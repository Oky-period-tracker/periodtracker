import { getRepository } from 'typeorm'
import { ArticleController } from '../../src/controller/ArticleController'

jest.mock('typeorm', () => ({ getRepository: jest.fn() }))
jest.mock('../../src/entity/Article', () => ({ Article: class {} }))
jest.mock('../../src/env', () => ({ env: { db: { schema: 'public' }, features: {} } }))
jest.mock('../../src/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

describe('article save and update', () => {
  let stored: any
  let save: jest.Mock
  let response: any
  let controller: ArticleController
  const request = (body: any, id?: string): any => ({
    body: {
      category: 'category',
      subcategory: 'subcategory',
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
      id: 'article',
      category: 'category',
      subcategory: 'subcategory',
      article_heading: 'Heading',
      article_text: 'Text',
      live: false,
      lang: 'en',
    }
    save = jest.fn(async (article) => article)
    ;(getRepository as jest.Mock).mockReturnValue({
      findOne: jest.fn(async (query) =>
        query === stored.id || query.article_heading === stored.article_heading
          ? { ...stored }
          : undefined,
      ),
      save,
    })
    response = { status: jest.fn().mockReturnThis(), send: jest.fn() }
    controller = new ArticleController()
  })

  it('creates an article with a category and a subcategory', async () => {
    const result = await controller.save(request({}), response, jest.fn())

    expect(save).toHaveBeenCalled()
    expect(result).toMatchObject({ category: 'category', subcategory: 'subcategory', lang: 'en' })
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
      request({ article_heading: 'Heading', subcategory: '' }, 'article'),
      response,
      jest.fn(),
    )

    expect(response.status).toHaveBeenCalledWith(400)
    expect(result).toBeUndefined()
    expect(save).not.toHaveBeenCalled()
  })

  it('still updates an article that keeps its category and subcategory', async () => {
    await controller.update(request({ article_heading: 'Heading' }, 'article'), response, jest.fn())

    expect(response.status).not.toHaveBeenCalled()
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'article', subcategory: 'subcategory' }),
    )
  })
})
