import { getRepository } from 'typeorm'
import { ArticleController } from '../../src/controller/ArticleController'

jest.mock('typeorm', () => ({ getRepository: jest.fn() }))
jest.mock('../../src/entity/Article', () => ({ Article: class Article {} }))
jest.mock('../../src/entity/Category', () => ({ Category: class Category {} }))
jest.mock('../../src/entity/Subcategory', () => ({ Subcategory: class Subcategory {} }))
jest.mock('../../src/env', () => ({ env: { db: { schema: 'public' }, features: {} } }))
jest.mock('../../src/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

// The controller only accepts uuids for the article's category and subcategory
const CATEGORY = '11111111-1111-4111-8111-111111111111'
const SUBCATEGORY = '22222222-2222-4222-8222-222222222222'
const ARTICLE = '33333333-3333-4333-8333-333333333333'

describe('article save and update', () => {
  let stored: any
  let save: jest.Mock
  let response: any
  let controller: ArticleController
  const request = (body: any, id?: string): any => ({
    body: {
      category: CATEGORY,
      subcategory: SUBCATEGORY,
      article_heading: 'New heading',
      article_text: 'Text',
      live: 'false',
      ...body,
    },
    params: { id },
    user: { lang: 'en' },
  })

  beforeEach(() => {
    stored = {
      id: ARTICLE,
      category: CATEGORY,
      subcategory: SUBCATEGORY,
      article_heading: 'Heading',
      article_text: 'Text',
      live: false,
      lang: 'en',
    }
    save = jest.fn(async (article) => article)
    const tables = {
      Article: [stored],
      Category: [{ id: CATEGORY, lang: 'en' }],
      Subcategory: [{ id: SUBCATEGORY, parent_category: CATEGORY, lang: 'en' }],
    }
    ;(getRepository as jest.Mock).mockImplementation((entity) => ({
      findOne: jest.fn(async (query) => {
        const row = tables[entity.name].find((candidate) =>
          Object.keys(query).every((key) => candidate[key] === query[key]),
        )
        return row && { ...row }
      }),
      save,
    }))
    response = { status: jest.fn().mockReturnThis(), send: jest.fn() }
    controller = new ArticleController()
  })

  it('creates an article with a category and a subcategory', async () => {
    const result = await controller.save(request({}), response, jest.fn())

    expect(save).toHaveBeenCalled()
    expect(result).toMatchObject({ category: CATEGORY, subcategory: SUBCATEGORY, lang: 'en' })
  })

  // jQuery sends an unselected dropdown (null) as an empty string
  it.each([
    [{ category: '', subcategory: '' }],
    [{ subcategory: '' }],
    [{ category: '' }],
    [{ subcategory: undefined }],
  ])('refuses to create an article with %p', async (body) => {
    const result = await controller.save(request(body), response, jest.fn())

    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.send).toHaveBeenCalledWith({ error: 'Choose a category and a subcategory' })
    expect(result).toBeUndefined()
    expect(save).not.toHaveBeenCalled()
  })

  it('refuses to move an article out of its subcategory', async () => {
    const result = await controller.update(
      request({ article_heading: 'Heading', subcategory: '' }, ARTICLE),
      response,
      jest.fn(),
    )

    expect(response.status).toHaveBeenCalledWith(400)
    expect(result).toBeUndefined()
    expect(save).not.toHaveBeenCalled()
  })

  it('still updates an article that keeps its category and subcategory', async () => {
    await controller.update(request({ article_heading: 'Heading' }, ARTICLE), response, jest.fn())

    expect(response.status).not.toHaveBeenCalled()
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({ id: ARTICLE, subcategory: SUBCATEGORY }),
    )
  })
})
