import { createConnection, Connection } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { Category } from '../../src/entity/Category'
import { Subcategory } from '../../src/entity/Subcategory'
import { Article } from '../../src/entity/Article'
import { CategoryController } from '../../src/controller/CategoryController'
import { SubcategoryController } from '../../src/controller/SubcategoryController'

let mockConnection: Connection
jest.mock('typeorm', () => ({
  ...jest.requireActual('typeorm'),
  getManager: () => mockConnection.manager,
  getRepository: (entity: any) => mockConnection.getRepository(entity),
}))
jest.mock('../../src/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

// Run against an isolated PostgreSQL instance; every object belongs to a unique test schema.
const databaseTests = process.env.CMS_TEST_DATABASE_SOCKET ? describe : describe.skip
const schema = `category_test_${process.pid}_${Date.now()}`
const response: any = { status: jest.fn().mockReturnThis(), send: jest.fn() }
const req = (id: string): any => ({ body: {}, params: { id }, user: { lang: 'en' } })

databaseTests('category and subcategory deletion with PostgreSQL', () => {
  let categoryController: CategoryController
  let subcategoryController: SubcategoryController
  beforeAll(async () => {
    mockConnection = await createConnection({
      name: schema,
      type: 'postgres',
      host: process.env.CMS_TEST_DATABASE_SOCKET,
      port: Number(process.env.CMS_TEST_DATABASE_PORT),
      username: process.env.USER,
      database: 'postgres',
      schema,
      entities: [Category, Subcategory, Article],
      synchronize: false,
      logging: false,
    })
    await mockConnection.query(`CREATE SCHEMA ${schema}`)
    await mockConnection.synchronize()
    categoryController = new CategoryController()
    subcategoryController = new SubcategoryController()
  })
  beforeEach(async () => {
    await mockConnection.query(
      `TRUNCATE ${schema}.article, ${schema}.subcategory, ${schema}.category CASCADE`,
    )
    jest.clearAllMocks()
  })
  afterAll(async () => {
    if (mockConnection?.isConnected) {
      await mockConnection.query(`DROP SCHEMA ${schema} CASCADE`)
      await mockConnection.close()
    }
  })

  // A category with two subcategories, each holding two articles.
  async function createHierarchy(title: string) {
    const category = await mockConnection.getRepository(Category).save({
      id: uuid(),
      title,
      primary_emoji: title,
      primary_emoji_name: title,
      lang: 'en',
    })
    const subcategories = []
    for (const name of ['first', 'second']) {
      const subcategory = await mockConnection.getRepository(Subcategory).save({
        id: uuid(),
        title: `${title} ${name}`,
        parent_category: category.id,
        lang: 'en',
      })
      subcategories.push(subcategory)
      for (const heading of ['one', 'two']) {
        await mockConnection.getRepository(Article).save({
          id: uuid(),
          category: category.id,
          subcategory: subcategory.id,
          article_heading: `${subcategory.title} ${heading}`,
          article_text: 'text',
          live: true,
          lang: 'en',
        })
      }
    }
    return { category, subcategories }
  }
  async function counts() {
    return {
      categories: await mockConnection.getRepository(Category).count(),
      subcategories: await mockConnection.getRepository(Subcategory).count(),
      articles: await mockConnection.getRepository(Article).count(),
    }
  }
  async function failDeleteOn(table: string, action: () => Promise<any>) {
    await mockConnection.query(
      `CREATE FUNCTION ${schema}.reject_delete() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'forced delete failure'; END; $$`,
    )
    await mockConnection.query(
      `CREATE TRIGGER reject_delete BEFORE DELETE ON ${schema}.${table} FOR EACH ROW EXECUTE PROCEDURE ${schema}.reject_delete()`,
    )
    try {
      await expect(action()).rejects.toThrow('forced delete failure')
    } finally {
      await mockConnection.query(`DROP TRIGGER reject_delete ON ${schema}.${table}`)
      await mockConnection.query(`DROP FUNCTION ${schema}.reject_delete()`)
    }
  }

  it.each(['article', 'subcategory', 'category'])(
    'keeps the whole category hierarchy when deleting the %s rows fails',
    async (table) => {
      const { category } = await createHierarchy('Health')
      await failDeleteOn(table, () =>
        categoryController.remove(req(category.id), response, jest.fn()),
      )
      expect(await counts()).toEqual({ categories: 1, subcategories: 2, articles: 4 })
    },
  )
  it('removes only the deleted category, its subcategories and its articles', async () => {
    const { category } = await createHierarchy('Health')
    const other = await createHierarchy('Body')
    const removed = await categoryController.remove(req(category.id), response, jest.fn())
    expect(removed!.title).toBe(category.title)
    expect(await counts()).toEqual({ categories: 1, subcategories: 2, articles: 4 })
    expect(await mockConnection.getRepository(Category).findOne(other.category.id)).toBeDefined()
    expect(await mockConnection.getRepository(Article).count({ category: other.category.id })).toBe(
      4,
    )
    await categoryController.remove(req(category.id), response, jest.fn())
    expect(response.status).toHaveBeenCalledWith(404)
  })

  it.each(['article', 'subcategory'])(
    'keeps the subcategory and its articles when deleting the %s rows fails',
    async (table) => {
      const { subcategories } = await createHierarchy('Health')
      await failDeleteOn(table, () =>
        subcategoryController.remove(req(subcategories[0].id), response, jest.fn()),
      )
      expect(await counts()).toEqual({ categories: 1, subcategories: 2, articles: 4 })
    },
  )
  it('removes only the deleted subcategory and its articles', async () => {
    const { category, subcategories } = await createHierarchy('Health')
    const removed = await subcategoryController.remove(
      req(subcategories[0].id),
      response,
      jest.fn(),
    )
    expect(removed!.title).toBe(subcategories[0].title)
    expect(await counts()).toEqual({ categories: 1, subcategories: 1, articles: 2 })
    expect(await mockConnection.getRepository(Category).findOne(category.id)).toBeDefined()
    expect(
      await mockConnection.getRepository(Article).count({ subcategory: subcategories[1].id }),
    ).toBe(2)
    await subcategoryController.remove(req(subcategories[0].id), response, jest.fn())
    expect(response.status).toHaveBeenCalledWith(404)
  })
})
