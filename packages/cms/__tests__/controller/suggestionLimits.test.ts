import { getRepository } from 'typeorm'
import { SuggestionController } from '../../src/controller/SuggestionController'

jest.mock('typeorm', () => ({ getRepository: jest.fn() }))
jest.mock('../../src/entity/Suggestion', () => ({ Suggestion: class {} }))
jest.mock('../../src/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

describe('public suggestion limits', () => {
  let save: jest.Mock
  let response: any
  let controller: SuggestionController

  // What the app's contact form sends
  const suggestion = () => ({
    name: 'user',
    dateRec: '2026-10-30T00:00:00.000Z',
    organization: 'user',
    platform: 'mobile',
    reason: { label: 'suggestion', value: 'suggestion' },
    email: 'NA',
    status: 'open',
    content: 'Please add more articles',
    lang: 'en',
  })

  beforeEach(() => {
    save = jest.fn(async (entity) => entity)
    ;(getRepository as jest.Mock).mockReturnValue({ save })
    response = { status: jest.fn().mockReturnThis(), send: jest.fn() }
    controller = new SuggestionController()
  })

  it('saves what the app sends, with only the known fields', async () => {
    const result = await controller.save(
      { body: { ...suggestion(), id: 'chosen-id', extra: 'x' } } as any,
      response,
      jest.fn(),
    )

    expect(save).toHaveBeenCalledTimes(1)
    const saved = save.mock.calls[0][0]
    expect(saved).toEqual({ ...suggestion(), id: expect.any(String) })
    expect(saved.id).not.toBe('chosen-id')
    expect(result).toBe(saved)
  })

  it('keeps a message at the limit', async () => {
    await controller.save(
      { body: { ...suggestion(), content: 'x'.repeat(5000) } } as any,
      response,
      jest.fn(),
    )

    expect(save).toHaveBeenCalledTimes(1)
  })

  it.each([
    ['content', 'x'.repeat(5001)],
    ['name', 'x'.repeat(256)],
    ['reason', { label: 'x'.repeat(300), value: 'suggestion' }],
  ])('rejects a %s that is too long without saving it', async (field, value) => {
    await controller.save({ body: { ...suggestion(), [field]: value } } as any, response, jest.fn())

    expect(response.status).toHaveBeenCalledWith(400)
    expect(response.send).toHaveBeenCalledWith({
      error: expect.stringContaining(`${field} is longer than`),
    })
    expect(save).not.toHaveBeenCalled()
  })

  it('rejects a batch of suggestions in one request', async () => {
    await controller.save({ body: [suggestion(), suggestion()] } as any, response, jest.fn())

    expect(response.status).toHaveBeenCalledWith(400)
    expect(save).not.toHaveBeenCalled()
  })
})
