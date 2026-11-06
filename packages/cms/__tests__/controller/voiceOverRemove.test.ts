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
  let update: jest.Mock
  let deleteFile: jest.Mock
  let controller: ArticleVoiceOverController
  const request = { body: { id: 'article' }, user: { lang: 'en' } }
  const response: any = {}
  const next = jest.fn()

  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    storedKey = key
    // Like the database, only clears the key the caller read
    update = jest.fn(async (criteria, changes) => {
      if (criteria.voiceOverKey !== storedKey) return { affected: 0 }
      storedKey = changes.voiceOverKey
      return { affected: 1 }
    })
    deleteFile = jest.fn(async () => undefined)
    ;(getRepository as jest.Mock).mockReturnValue({
      findOne: async () => ({ id: 'article', voiceOverKey: storedKey }),
      update,
    })
    ;((storage as unknown) as jest.Mock).mockReturnValue({
      bucket: () => ({ file: () => ({ delete: deleteFile }) }),
    })
    controller = new ArticleVoiceOverController()
  })

  afterEach(() => jest.useRealTimers())

  it('keeps the audio if clearing the database reference fails', async () => {
    update.mockRejectedValue(new Error('Database unavailable'))
    await expect(controller.remove(request as any, response, next)).rejects.toThrow(
      'Database unavailable',
    )
    await jest.runAllTimersAsync()
    expect(storedKey).toBe(key)
    expect(deleteFile).not.toHaveBeenCalled()
  })

  it('deletes the audio only after the reference is cleared', async () => {
    const result = await controller.remove(request as any, response, next)
    await jest.runAllTimersAsync()
    expect(result.voiceOverKey).toBeNull()
    expect(storedKey).toBeNull()
    expect(update).toHaveBeenCalledWith(
      { id: 'article', voiceOverKey: key },
      { voiceOverKey: null },
    )
    expect(deleteFile).toHaveBeenCalledTimes(1)
    expect(update.mock.invocationCallOrder[0]).toBeLessThan(deleteFile.mock.invocationCallOrder[0])
  })

  it('keeps a voice-over uploaded while the removal was running', async () => {
    const uploadedKey = 'article-new-audio.mp3'
    update.mockImplementationOnce(async () => {
      storedKey = uploadedKey
      return { affected: 0 }
    })
    const result = await controller.remove(request as any, response, next)
    await jest.runAllTimersAsync()
    expect(result.voiceOverKey).toBe(uploadedKey)
    expect(storedKey).toBe(uploadedKey)
    expect(deleteFile).not.toHaveBeenCalled()
  })

  it('writes and deletes nothing for an article without a voice-over', async () => {
    storedKey = null
    const result = await controller.remove(request as any, response, next)
    await jest.runAllTimersAsync()
    expect(result.voiceOverKey).toBeNull()
    expect(update).not.toHaveBeenCalled()
    expect(deleteFile).not.toHaveBeenCalled()
  })

  it('retries a failed cleanup and logs the key once without failing the removal', async () => {
    deleteFile.mockRejectedValue(new Error('Storage unavailable'))
    const result = await controller.remove(request as any, response, next)
    expect(result.voiceOverKey).toBeNull()
    await jest.runAllTimersAsync()
    expect(deleteFile).toHaveBeenCalledTimes(3)
    expect(logger.error).toHaveBeenCalledTimes(1)
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining(key),
      expect.objectContaining({ message: 'Storage unavailable' }),
    )
  })
})
