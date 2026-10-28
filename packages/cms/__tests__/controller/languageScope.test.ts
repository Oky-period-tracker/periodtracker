import { getRepository } from 'typeorm'
import { CategoryController } from '../../src/controller/CategoryController'
import { SubcategoryController } from '../../src/controller/SubcategoryController'
import { ArticleController } from '../../src/controller/ArticleController'
import { AboutController } from '../../src/controller/AboutController'

jest.mock('typeorm', () => ({ getRepository: jest.fn() }))
jest.mock('../../src/entity/Category', () => ({ Category: class Category {} }))
jest.mock('../../src/entity/Subcategory', () => ({ Subcategory: class Subcategory {} }))
jest.mock('../../src/entity/Article', () => ({ Article: class Article {} }))
jest.mock('../../src/entity/About', () => ({ About: class About {} }))
jest.mock('../../src/env', () => ({ env: { db: { schema: 'public' }, features: {} } }))
jest.mock('../../src/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

const matches = (row: any, where: any) =>
  Object.keys(where).every((key) => String(row[key]) === String(where[key]))

// In-memory table supporting findOne(conditions) and findOne(id, { where })
const repository = (rows: any[]) => ({
  findOne: async (idOrConditions: any, options?: any) => {
    const where =
      typeof idOrConditions === 'object'
        ? idOrConditions
        : { ...options?.where, id: idOrConditions }
    const row = rows.find((candidate) => matches(candidate, where))
    return row && { ...row }
  },
  find: async (options?: any) => rows.filter((row) => matches(row, options?.where ?? {})),
  query: async () => [],
  save: async (entity: any) => {
    const index = rows.findIndex((row) => row.id === entity.id)
    rows[index >= 0 ? index : rows.length] = { ...entity }
    return entity
  },
  remove: async (entities: any) => {
    for (const entity of [].concat(entities)) {
      rows.splice(
        rows.findIndex((row) => row.id === entity.id),
        1,
      )
    }
    return entities
  },
})

describe('content language scope', () => {
  let tables: Record<string, any[]>
  let response: any
  const next = jest.fn()
  const request = (lang: string, id: string, body: any = {}): any => ({
    params: { id },
    user: { lang },
    body,
  })
  const row = (table: string, id: any) => tables[table].find((candidate) => candidate.id === id)

  beforeEach(() => {
    tables = {
      Category: [
        { id: 'cat-en', title: 'Body', primary_emoji: 'B', lang: 'en' },
        { id: 'cat-es', title: 'Cuerpo', primary_emoji: 'C', lang: 'es' },
      ],
      Subcategory: [
        { id: 'sub-en', title: 'Periods', parent_category: 'cat-en', lang: 'en' },
        { id: 'sub-es', title: 'Reglas', parent_category: 'cat-es', lang: 'es' },
      ],
      Article: [
        {
          id: 'art-en',
          category: 'cat-en',
          subcategory: 'sub-en',
          article_heading: 'Heading',
          lang: 'en',
        },
      ],
      About: [
        { id: 1, json_dump: 'about-en', lang: 'en' },
        { id: 2, json_dump: 'about-es', lang: 'es' },
      ],
    }
    ;(getRepository as jest.Mock).mockImplementation((entity) => repository(tables[entity.name]))
    response = { status: jest.fn().mockReturnThis(), send: jest.fn() }
  })

  it('updates a category in the editor language and keeps its language', async () => {
    await new CategoryController().update(
      request('es', 'cat-es', { title: 'Cuerpo humano', primary_emoji: 'C' }),
      response,
      next,
    )

    expect(response.status).not.toHaveBeenCalled()
    expect(row('Category', 'cat-es')).toMatchObject({ title: 'Cuerpo humano', lang: 'es' })
  })

  it('answers 404 and leaves the row untouched when the category is in another language', async () => {
    const before = { ...row('Category', 'cat-es') }

    await new CategoryController().update(
      request('en', 'cat-es', { title: 'Hijacked', primary_emoji: 'H' }),
      response,
      next,
    )

    expect(response.status).toHaveBeenCalledWith(404)
    expect(row('Category', 'cat-es')).toEqual(before)
  })

  it.each(['one', 'remove'])(
    'answers 404 to %s for a category in another language',
    async (action) => {
      await new CategoryController()[action](request('en', 'cat-es'), response, next)

      expect(response.status).toHaveBeenCalledWith(404)
      expect(row('Category', 'cat-es')).toBeDefined()
    },
  )

  it('refuses a subcategory whose parent category is in another language', async () => {
    const controller = new SubcategoryController()

    await controller.save(
      request('en', undefined, { title: 'New', parent_category: 'cat-es' }),
      response,
      next,
    )
    await controller.update(
      request('en', 'sub-en', { title: 'Periods', parent_category: 'cat-es' }),
      response,
      next,
    )

    expect(response.status).toHaveBeenNthCalledWith(1, 404)
    expect(response.status).toHaveBeenNthCalledWith(2, 404)
    expect(tables.Subcategory).toHaveLength(2)
    expect(row('Subcategory', 'sub-en').parent_category).toBe('cat-en')
  })

  it('refuses an article whose category or subcategory is in another language', async () => {
    await new ArticleController().update(
      request('en', 'art-en', {
        category: 'cat-es',
        subcategory: 'sub-es',
        article_heading: 'Heading',
      }),
      response,
      next,
    )

    expect(response.status).toHaveBeenCalledWith(404)
    expect(row('Article', 'art-en')).toMatchObject({ category: 'cat-en', subcategory: 'sub-en' })
  })

  it('scopes content with numeric ids the same way', async () => {
    const controller = new AboutController()

    await controller.update(request('en', '2', { json_dump: 'hijacked' }), response, next)
    expect(response.status).toHaveBeenCalledWith(404)
    expect(row('About', 2)).toEqual({ id: 2, json_dump: 'about-es', lang: 'es' })

    await controller.update(request('es', '2', { json_dump: 'nuevo' }), response, next)
    expect(row('About', 2)).toEqual({ id: 2, json_dump: 'nuevo', lang: 'es' })
  })
})
