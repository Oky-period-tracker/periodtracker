import { getRepository } from 'typeorm'
import { storage } from 'firebase-admin'
import { ArticleVoiceOverController } from '../../src/controller/ArticleVoiceOverController'
import { logger } from '../../src/logger'

jest.mock('typeorm', () => ({ getRepository: jest.fn() }))
jest.mock('../../src/entity/Article', () => ({ Article: class {} }))
jest.mock('firebase-admin', () => ({ storage: jest.fn() }))
jest.mock('../../src/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

describe('voice-over removal', () => {
  const key = 'article-audio.mp3'
  let storedKey: string | null
  let save: jest.Mock
  let deleteFile: jest.Mock
  let controller: ArticleVoiceOverController
  const request = { body: { id: 'article' } }
  const response: any = {}
  const next = jest.fn()

  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    storedKey = key
    save = jest.fn(async (article) => {
      storedKey = article.voiceOverKey
      return article
    })
    deleteFile = jest.fn(async () => undefined)
    ;(getRepository as jest.Mock).mockReturnValue({
      findOne: async () => ({ id: 'article', voiceOverKey: storedKey }),
      save,
    })
    ;((storage as unknown) as jest.Mock).mockReturnValue({
      bucket: () => ({ file: () => ({ delete: deleteFile }) }),
    })
    controller = new ArticleVoiceOverController()
  })

  afterEach(() => jest.useRealTimers())

  it('keeps the audio if clearing the database reference fails', async () => {
    save.mockRejectedValue(new Error('Database unavailable'))
    await expect(controller.remove(request as any, response, next)).rejects.toThrow(
      'Database unavailable',
    )
    await jest.runAllTimersAsync()
    expect(storedKey).toBe(key)
    expect(deleteFile).not.toHaveBeenCalled()
  })

  it('deletes the audio only after the cleared reference is saved', async () => {
    const result = await controller.remove(request as any, response, next)
    await jest.runAllTimersAsync()
    expect(result.voiceOverKey).toBeNull()
    expect(storedKey).toBeNull()
    expect(deleteFile).toHaveBeenCalledTimes(1)
    expect(save.mock.invocationCallOrder[0]).toBeLessThan(deleteFile.mock.invocationCallOrder[0])
  })

  it('retries a failed cleanup and logs the key without failing the removal', async () => {
    deleteFile.mockRejectedValue(new Error('Storage unavailable'))
    const result = await controller.remove(request as any, response, next)
    expect(result.voiceOverKey).toBeNull()
    await jest.runAllTimersAsync()
    expect(deleteFile).toHaveBeenCalledTimes(3)
    expect(logger.error).toHaveBeenCalledWith(
      'Failed to delete unused voice-over file',
      expect.objectContaining({ key }),
    )
  })
})
