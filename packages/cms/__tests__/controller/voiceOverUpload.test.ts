import { getRepository } from 'typeorm'
import { storage } from 'firebase-admin'
import { ArticleVoiceOverController } from '../../src/controller/ArticleVoiceOverController'

jest.mock('typeorm', () => ({ getRepository: jest.fn() }))
jest.mock('../../src/entity/Article', () => ({ Article: class {} }))
jest.mock('firebase-admin', () => ({ storage: jest.fn() }))
jest.mock('../../src/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

describe('voice-over replacement', () => {
  let oldKey: string
  let storedKey: string
  let files: Map<string, any>
  let uploadFinished: (err?: Error) => void
  let save: jest.Mock
  let response: any
  let next: jest.Mock
  let controller: ArticleVoiceOverController
  const request = {
    body: { id: 'article' },
    file: { originalname: 'audio.mp3', buffer: Buffer.from('audio'), mimetype: 'audio/mpeg' },
  }

  beforeEach(() => {
    jest.useFakeTimers()
    oldKey = storedKey = 'article-audio.mp3'
    files = new Map()
    save = jest.fn(async (article) => {
      storedKey = article.voiceOverKey
      return article
    })
    ;(getRepository as jest.Mock).mockReturnValue({
      findOne: async () => ({ id: 'article', voiceOverKey: oldKey }),
      save,
    })
    ;((storage as unknown) as jest.Mock).mockReturnValue({
      bucket: () => ({
        file: (key: string) => {
          if (!files.has(key))
            files.set(key, {
              save: jest.fn((_buffer, _options, callback) => {
                uploadFinished = callback
              }),
              delete: jest.fn(async () => undefined),
            })
          return files.get(key)
        },
      }),
    })
    response = { headersSent: false, status: jest.fn().mockReturnThis(), send: jest.fn() }
    next = jest.fn()
    storage().bucket().file(oldKey)
    controller = new ArticleVoiceOverController()
  })

  afterEach(() => jest.useRealTimers())

  it('preserves the old audio after a timeout and cleans up a late upload', async () => {
    const pending = controller.upload(request as any, response, next)
    await jest.advanceTimersByTimeAsync(15001)
    await pending
    expect(storedKey).toBe(oldKey)
    expect(files.get(oldKey)?.delete).not.toHaveBeenCalled()
    const replacement = [...files.entries()].find(([key, file]) => file.save.mock.calls.length)!
    expect(replacement[0]).not.toBe(oldKey)
    uploadFinished()
    await jest.advanceTimersByTimeAsync(0)
    expect(replacement[1].delete).toHaveBeenCalledTimes(1)
    expect(save).not.toHaveBeenCalled()
  })

  it('deletes the old audio only after the new reference is saved', async () => {
    const pending = controller.upload(request as any, response, next)
    await jest.advanceTimersByTimeAsync(0)
    expect(files.get(oldKey)?.delete).not.toHaveBeenCalled()
    uploadFinished()
    await pending
    expect(storedKey).not.toBe(oldKey)
    expect(files.get(oldKey).delete).toHaveBeenCalledTimes(1)
    expect(save.mock.invocationCallOrder[0]).toBeLessThan(
      files.get(oldKey).delete.mock.invocationCallOrder[0],
    )
    expect(response.status).toHaveBeenCalledWith(200)
  })

  it('preserves old audio if saving the database reference fails', async () => {
    save.mockRejectedValue(new Error('Database unavailable'))
    const pending = controller.upload(request as any, response, next)
    await jest.advanceTimersByTimeAsync(0)
    uploadFinished()
    await pending
    expect(storedKey).toBe(oldKey)
    expect(files.get(oldKey)?.delete).not.toHaveBeenCalled()
    expect(response.status).toHaveBeenCalledWith(500)
  })

  it('does not send another response if the HTTP request has already timed out', async () => {
    const pending = controller.upload(request as any, response, next)
    await jest.advanceTimersByTimeAsync(0)
    response.headersSent = true
    uploadFinished()
    await pending
    expect(response.send).not.toHaveBeenCalled()
  })
})
