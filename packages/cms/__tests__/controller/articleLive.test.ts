import { getRepository } from 'typeorm'
import { ArticleController } from '../../src/controller/ArticleController'

jest.mock('typeorm', () => ({ getRepository: jest.fn() }))
jest.mock('../../src/entity/Article', () => ({ Article: class {} }))
jest.mock('../../src/env', () => ({ env: { db: { schema: 'public' }, features: {} } }))
jest.mock('../../src/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

describe('article live toggle', () => {
  let stored: any
  let save: jest.Mock
  let response: any
  let controller: ArticleController
  const request = (live: any, id = 'article', lang = 'en'): any => ({
    body: { live },
    params: { id },
    user: { lang },
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
      findOne: jest.fn(async ({ id, lang }) =>
        id === stored.id && lang === stored.lang ? { ...stored } : undefined,
      ),
      save,
    })
    response = { status: jest.fn().mockReturnThis(), send: jest.fn() }
    controller = new ArticleController()
  })

  it.each([
    ['true', true],
    [true, true],
    ['false', false],
    [false, false],
  ])('saves live=%p as %p and returns the stored status', async (live, expected) => {
    stored.live = !expected
    const result = await controller.updateLive(request(live), response, jest.fn())

    expect(save).toHaveBeenCalledWith({ ...stored, live: expected })
    expect(result).toEqual({ id: 'article', live: expected })
  })

  it('leaves the rest of the article untouched', async () => {
    await controller.updateLive(request('true'), response, jest.fn())

    const { live, ...rest } = save.mock.calls[0][0]
    const { live: _, ...storedRest } = stored
    expect(rest).toEqual(storedRest)
  })

  it.each([undefined, '', 'on', '1'])('rejects live=%p without saving', async (live) => {
    await controller.updateLive(request(live), response, jest.fn())

    expect(response.status).toHaveBeenCalledWith(400)
    expect(save).not.toHaveBeenCalled()
  })

  it('answers 404 for an unknown article', async () => {
    await controller.updateLive(request('true', 'missing'), response, jest.fn())

    expect(response.status).toHaveBeenCalledWith(404)
    expect(save).not.toHaveBeenCalled()
  })

  it("answers 404 for an article in another editor's language", async () => {
    await controller.updateLive(request('true', 'article', 'fr'), response, jest.fn())

    expect(response.status).toHaveBeenCalledWith(404)
    expect(save).not.toHaveBeenCalled()
  })
})
