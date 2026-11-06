import { DataController } from '../../src/controller/DataController'
import { Quiz } from '../../src/entity/Quiz'
import { DidYouKnow } from '../../src/entity/DidYouKnow'
import { HelpCenter } from '../../src/entity/HelpCenter'
import { AvatarMessages } from '../../src/entity/AvatarMessages'

const mockQuery = jest.fn(async (_sql: string, _params: any[]) => [])
const mockFind = jest.fn(async (_entity: any, _options: any) => [])
jest.mock('typeorm', () => ({
  ...jest.requireActual('typeorm'),
  getRepository: (entity: any) => ({
    query: mockQuery,
    find: (options: any) => mockFind(entity, options),
    findOne: async () => undefined,
  }),
}))
jest.mock('@oky/core', () => ({
  fromEncyclopedia: () => ({ articles: {}, categories: {}, subCategories: {} }),
  fromQuizzes: () => ({ quizzes: {} }),
  fromDidYouKnows: () => ({ didYouKnows: {} }),
  fromHelpCenters: () => ({ helpCenters: [] }),
  fromAvatarMessages: () => ({ avatarMessages: [] }),
}))
jest.mock('../../src/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

const response: any = { setHeader: jest.fn(), send: jest.fn() }
const exportContent = (live?: string) =>
  new DataController().generateContentTs(
    { query: live ? { live } : {}, user: { lang: 'en' } } as any,
    response,
    jest.fn(),
  )
const whereFor = (entity: any) => mockFind.mock.calls.find(([called]) => called === entity)[1].where

describe('content TS export', () => {
  beforeEach(() => jest.clearAllMocks())

  it('exports only published content for Download LIVE TS', async () => {
    await exportContent('true')
    expect(mockQuery.mock.calls[0][0]).toContain('AND ar.live = true')
    expect(whereFor(Quiz)).toEqual({ lang: 'en', live: true })
    expect(whereFor(DidYouKnow)).toEqual({ lang: 'en', live: true })
    expect(whereFor(HelpCenter)).toEqual({ lang: 'en', isActive: true })
    expect(whereFor(AvatarMessages)).toEqual({ lang: 'en', live: true })
  })

  it('exports drafts and published content for Download TS', async () => {
    await exportContent()
    expect(mockQuery.mock.calls[0][0]).not.toContain('ar.live = true')
    for (const entity of [Quiz, DidYouKnow, HelpCenter, AvatarMessages]) {
      expect(whereFor(entity)).toEqual({ lang: 'en' })
    }
  })
})
