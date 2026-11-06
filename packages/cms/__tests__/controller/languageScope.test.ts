import { getRepository } from 'typeorm'
import { CategoryController } from '../../src/controller/CategoryController'
import { SubcategoryController } from '../../src/controller/SubcategoryController'
import { ArticleController } from '../../src/controller/ArticleController'
import { AboutController } from '../../src/controller/AboutController'
import { AboutBannerController } from '../../src/controller/AboutBannerController'
import { PrivacyPolicyController } from '../../src/controller/PrivacyPolicyController'
import { TermsAndConditionsController } from '../../src/controller/TermsAndConditionsController'
import { NotificationController } from '../../src/controller/NotificationController'
import { VideoController } from '../../src/controller/VideoController'

jest.mock('typeorm', () => ({ getRepository: jest.fn() }))
jest.mock('../../src/entity/Category', () => ({ Category: class Category {} }))
jest.mock('../../src/entity/Subcategory', () => ({ Subcategory: class Subcategory {} }))
jest.mock('../../src/entity/Article', () => ({ Article: class Article {} }))
jest.mock('../../src/entity/About', () => ({ About: class About {} }))
jest.mock('../../src/entity/AboutBanner', () => ({ AboutBanner: class AboutBanner {} }))
jest.mock('../../src/entity/PrivacyPolicy', () => ({ PrivacyPolicy: class PrivacyPolicy {} }))
jest.mock('../../src/entity/TermsAndConditions', () => ({
  TermsAndConditions: class TermsAndConditions {},
}))
jest.mock('../../src/entity/Notification', () => ({ Notification: class Notification {} }))
jest.mock('../../src/entity/PermanentNotification', () => ({
  PermanentNotification: class PermanentNotification {},
}))
jest.mock('../../src/entity/Video', () => ({ Video: class Video {} }))
jest.mock('firebase-admin', () => ({}))
jest.mock('../../src/env', () => ({ env: { db: { schema: 'public' }, features: {} } }))
jest.mock('../../src/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

const matches = (row: any, where: any) =>
  Object.keys(where).every((key) => String(row[key]) === String(where[key]))

// In-memory table supporting findOne(conditions), findOne({ where }) with OR-ed
// alternatives and findOne(id, { where }). Like TypeORM, save() overwrites the row
// whose id it is given and creates one otherwise.
const repository = (rows: any[]) => ({
  findOne: async (idOrConditions: any, options?: any) => {
    const where =
      typeof idOrConditions !== 'object'
        ? { ...options?.where, id: idOrConditions }
        : 'where' in idOrConditions
        ? idOrConditions.where
        : idOrConditions
    const row = rows.find((candidate) =>
      [].concat(where).some((alternative) => matches(candidate, alternative)),
    )
    return row && { ...row }
  },
  find: async (options?: any) => rows.filter((row) => matches(row, options?.where ?? {})),
  create: (entity: any) => ({ ...entity }),
  save: async (entity: any) => {
    if (entity.id === undefined) entity.id = Math.max(0, ...rows.map((row) => row.id)) + 1
    const index = rows.findIndex((row) => String(row.id) === String(entity.id))
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

const CAT_EN = '11111111-1111-4111-8111-111111111111'
const CAT_EN_OTHER = '11111111-1111-4111-8111-222222222222'
const CAT_ES = '22222222-2222-4222-8222-222222222222'
const SUB_EN = '33333333-3333-4333-8333-333333333333'
const SUB_EN_OTHER = '33333333-3333-4333-8333-444444444444'
const SUB_ES = '44444444-4444-4444-8444-444444444444'
const ART_EN = '55555555-5555-4555-8555-555555555555'
const ART_ES = '66666666-6666-4666-8666-666666666666'
const VID_EN = '77777777-7777-4777-8777-777777777777'
const VID_ES = '88888888-8888-4888-8888-888888888888'

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
        { id: CAT_EN, title: 'Body', primary_emoji: 'B', lang: 'en' },
        { id: CAT_EN_OTHER, title: 'Rights', primary_emoji: 'R', lang: 'en' },
        { id: CAT_ES, title: 'Cuerpo', primary_emoji: 'C', lang: 'es' },
      ],
      Subcategory: [
        { id: SUB_EN, title: 'Periods', parent_category: CAT_EN, lang: 'en' },
        { id: SUB_EN_OTHER, title: 'Laws', parent_category: CAT_EN_OTHER, lang: 'en' },
        { id: SUB_ES, title: 'Reglas', parent_category: CAT_ES, lang: 'es' },
      ],
      Article: [
        {
          id: ART_EN,
          category: CAT_EN,
          subcategory: SUB_EN,
          article_heading: 'Heading',
          lang: 'en',
        },
        {
          id: ART_ES,
          category: CAT_ES,
          subcategory: SUB_ES,
          article_heading: 'Titulo',
          lang: 'es',
        },
      ],
      Video: [
        { id: VID_EN, title: 'Video', lang: 'en' },
        { id: VID_ES, title: 'Vídeo', lang: 'es' },
      ],
      About: [
        { id: 1, json_dump: 'about-en', lang: 'en' },
        { id: 2, json_dump: 'about-es', lang: 'es' },
      ],
      PrivacyPolicy: [{ id: 2, json_dump: 'privacy-es', lang: 'es' }],
      TermsAndConditions: [{ id: 2, json_dump: 'terms-es', lang: 'es' }],
      PermanentNotification: [{ id: 2, message: 'alerta', lang: 'es' }],
      Notification: [],
      AboutBanner: [{ id: 2, image: '/es.png', lang: 'es' }],
    }
    ;(getRepository as jest.Mock).mockImplementation((entity) => repository(tables[entity.name]))
    response = { status: jest.fn().mockReturnThis(), send: jest.fn() }
  })

  it('updates a category in the editor language and keeps its language', async () => {
    await new CategoryController().update(
      request('es', CAT_ES, { title: 'Cuerpo humano', primary_emoji: 'C' }),
      response,
      next,
    )

    expect(response.status).not.toHaveBeenCalled()
    expect(row('Category', CAT_ES)).toMatchObject({ title: 'Cuerpo humano', lang: 'es' })
  })

  it('answers 404 and leaves the row untouched when the category is in another language', async () => {
    const before = { ...row('Category', CAT_ES) }

    await new CategoryController().update(
      request('en', CAT_ES, { title: 'Hijacked', primary_emoji: 'H' }),
      response,
      next,
    )

    expect(response.status).toHaveBeenCalledWith(404)
    expect(row('Category', CAT_ES)).toEqual(before)
  })

  it.each(['one', 'remove'])(
    'answers 404 to %s for a category in another language',
    async (action) => {
      await new CategoryController()[action](request('en', CAT_ES), response, next)

      expect(response.status).toHaveBeenCalledWith(404)
      expect(row('Category', CAT_ES)).toBeDefined()
    },
  )

  it('refuses a subcategory whose parent category is in another language', async () => {
    const controller = new SubcategoryController()

    await controller.save(
      request('en', undefined, { title: 'New', parent_category: CAT_ES }),
      response,
      next,
    )
    await controller.update(
      request('en', SUB_EN, { title: 'Periods', parent_category: CAT_ES }),
      response,
      next,
    )

    expect(response.status).toHaveBeenNthCalledWith(1, 404)
    expect(response.status).toHaveBeenNthCalledWith(2, 404)
    expect(tables.Subcategory).toHaveLength(3)
    expect(row('Subcategory', SUB_EN).parent_category).toBe(CAT_EN)
  })

  it('refuses an article whose category or subcategory is in another language', async () => {
    await new ArticleController().update(
      request('en', ART_EN, {
        category: CAT_ES,
        subcategory: SUB_ES,
        article_heading: 'Heading',
      }),
      response,
      next,
    )

    expect(response.status).toHaveBeenCalledWith(404)
    expect(row('Article', ART_EN)).toMatchObject({ category: CAT_EN, subcategory: SUB_EN })
  })

  it('scopes content with numeric ids the same way', async () => {
    const controller = new AboutController()

    await controller.update(request('en', '2', { json_dump: 'hijacked' }), response, next)
    expect(response.status).toHaveBeenCalledWith(404)
    expect(row('About', 2)).toEqual({ id: 2, json_dump: 'about-es', lang: 'es' })

    await controller.update(request('es', '2', { json_dump: 'nuevo' }), response, next)
    expect(row('About', 2)).toEqual({ id: 2, json_dump: 'nuevo', lang: 'es' })
  })

  it.each([
    ['a category that is not a uuid', { category: 'nope', subcategory: SUB_EN }],
    ['a subcategory that is not a uuid', { category: CAT_EN, subcategory: 'nope' }],
    ['a subcategory of another category', { category: CAT_EN, subcategory: SUB_EN_OTHER }],
  ])('refuses an article with %s', async (_, parents) => {
    const controller = new ArticleController()
    const body = { ...parents, article_heading: 'Brand new' }

    await controller.save(request('en', undefined, body), response, next)
    await controller.update(request('en', ART_EN, body), response, next)

    expect(response.status).toHaveBeenNthCalledWith(1, 404)
    expect(response.status).toHaveBeenNthCalledWith(2, 404)
    expect(tables.Article).toHaveLength(2)
    expect(row('Article', ART_EN)).toMatchObject({ category: CAT_EN, subcategory: SUB_EN })
  })

  it('refuses a subcategory whose parent category is not a uuid', async () => {
    await new SubcategoryController().save(
      request('en', undefined, { title: 'New', parent_category: '' }),
      response,
      next,
    )

    expect(response.status).toHaveBeenCalledWith(404)
    expect(tables.Subcategory).toHaveLength(3)
  })

  describe('create endpoints', () => {
    it.each([
      ['About', () => new AboutController()],
      ['PrivacyPolicy', () => new PrivacyPolicyController()],
      ['TermsAndConditions', () => new TermsAndConditionsController()],
    ])('creates a %s row instead of overwriting the id in the body', async (table, controller) => {
      const before = { ...row(table, 2) }

      const saved = await controller().save(
        request('en', undefined, { id: 2, json_dump: 'hijacked', lang: 'es' }),
        response,
        next,
      )

      expect(row(table, 2)).toEqual(before)
      expect(saved.id).not.toBe(2)
      expect(row(table, saved.id)).toMatchObject({ json_dump: 'hijacked', lang: 'en' })
    })

    it('creates a permanent alert instead of overwriting the id in the body', async () => {
      const saved = await new NotificationController().savePermanentAlert(
        request('en', undefined, { id: 2, message: 'hijacked', live: 'true' }),
        response,
        next,
      )

      expect(row('PermanentNotification', 2)).toEqual({ id: 2, message: 'alerta', lang: 'es' })
      expect(row('PermanentNotification', saved.id)).toMatchObject({
        message: 'hijacked',
        live: true,
        isPermanent: false,
        lang: 'en',
      })
    })

    it('creates an about banner instead of overwriting the id in the body', async () => {
      const saved = await new AboutBannerController().saveOrUpdate(
        request('en', undefined, { id: 2, image: '/en.png' }),
        response,
        next,
      )

      expect(row('AboutBanner', 2)).toEqual({ id: 2, image: '/es.png', lang: 'es' })
      expect(row('AboutBanner', saved.id)).toMatchObject({ image: '/en.png', lang: 'en' })
    })
  })

  describe('duplicate title checks', () => {
    const parents = { category: CAT_EN, subcategory: SUB_EN }

    // Titles, and the category emoji, taken from the Spanish rows. Built per test:
    // the controllers write the new id and language onto the body they are given
    const reused = (kind: string) =>
      ({
        article: { ...parents, article_heading: 'Titulo' },
        category: { title: 'Cuerpo', primary_emoji: 'C' },
        video: { title: 'Vídeo' },
      }[kind])

    it.each([
      ['article', () => new ArticleController(), 'Article'],
      ['category', () => new CategoryController(), 'Category'],
      ['video', () => new VideoController(), 'Video'],
    ])(
      'creates a %s whose title only exists in another language',
      async (kind, controller, table) => {
        const count = tables[table].length

        const result = await controller().save(
          request('en', undefined, reused(kind)),
          response,
          next,
        )

        expect(result.isExist ?? result.duplicate).toBeUndefined()
        expect(tables[table]).toHaveLength(count + 1)
        expect(tables[table][count]).toMatchObject({ ...reused(kind), lang: 'en' })
      },
    )

    it.each([
      ['article', () => new ArticleController(), ART_EN],
      ['category', () => new CategoryController(), CAT_EN],
      ['video', () => new VideoController(), VID_EN],
    ])(
      'renames a %s to a title that only exists in another language',
      async (kind, controller, id) => {
        const result = await controller().update(request('en', id, reused(kind)), response, next)

        expect(response.status).not.toHaveBeenCalled()
        expect(result).toMatchObject({ id, ...reused(kind), lang: 'en' })
      },
    )

    it('still reports an article title already used in the editor language', async () => {
      const result = await new ArticleController().save(
        request('en', undefined, { ...parents, article_heading: 'Heading' }),
        response,
        next,
      )

      expect(result).toMatchObject({ isExist: true, article: { id: ART_EN } })
      expect(tables.Article).toHaveLength(2)
    })

    it('still reports a category title already used in the editor language', async () => {
      const result = await new CategoryController().update(
        request('en', CAT_EN_OTHER, { title: 'Body', primary_emoji: 'X' }),
        response,
        next,
      )

      expect(result).toMatchObject({ duplicate: true, category: { id: CAT_EN } })
      expect(row('Category', CAT_EN_OTHER).title).toBe('Rights')
    })

    // The title matches a row of the target's own language: the answer must stay a
    // 404 rather than hand that row over
    it.each([
      [
        'article',
        () => new ArticleController(),
        ART_ES,
        { article_heading: 'Heading', category: CAT_EN, subcategory: SUB_EN },
      ],
      ['category', () => new CategoryController(), CAT_ES, { title: 'Body' }],
      ['video', () => new VideoController(), VID_ES, { title: 'Video' }],
    ])(
      'answers 404 without a duplicate to an update of a %s in another language',
      async (_, controller, id, body) => {
        const result = await controller().update(request('en', id, body), response, next)

        expect(response.status).toHaveBeenCalledWith(404)
        expect(result).toBeUndefined()
      },
    )
  })
})
