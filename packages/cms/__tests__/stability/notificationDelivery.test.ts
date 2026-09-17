import { getRepository } from 'typeorm'
import * as admin from 'firebase-admin'
import { NotificationController } from '../../src/controller/NotificationController'

jest.mock('typeorm', () => ({ getRepository: jest.fn() }))
jest.mock('../../src/entity/Notification', () => ({ Notification: class {} }))
jest.mock('../../src/entity/PermanentNotification', () => ({ PermanentNotification: class {} }))
jest.mock('firebase-admin', () => ({ messaging: jest.fn() }))
jest.mock('../../src/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

describe('notification delivery', () => {
  const send = jest.fn()
  const save = jest.fn()
  const request = () => ({ body: { title: 'Test', content: 'Message' }, user: { lang: 'en' } })

  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    ;(getRepository as jest.Mock).mockReturnValue({ save })
    ;(admin.messaging as jest.Mock).mockReturnValue({ send })
  })

  afterEach(() => jest.useRealTimers())

  it('does not resend when the first delivery completes after the timeout', async () => {
    let complete: (id: string) => void
    send.mockImplementation(
      () =>
        new Promise<string>((resolve) => {
          complete = resolve
        }),
    )
    const result = new NotificationController().save(request() as any, {} as any, jest.fn()).then(
      () => null,
      (error) => error,
    )
    await jest.advanceTimersByTimeAsync(16000)
    expect(send).toHaveBeenCalledTimes(1)
    complete!('delivered-late')
    await jest.advanceTimersByTimeAsync(60000)
    expect(await result).toBeInstanceOf(Error)
    expect(send).toHaveBeenCalledTimes(1)
    expect(save).not.toHaveBeenCalled()
  })

  it('does not retry a rejected send or record it as sent', async () => {
    send.mockRejectedValue(new Error('Firebase unavailable'))
    const result = new NotificationController().save(request() as any, {} as any, jest.fn()).then(
      () => null,
      (error) => error,
    )
    await jest.advanceTimersByTimeAsync(60000)
    expect(await result).toBeInstanceOf(Error)
    expect(send).toHaveBeenCalledTimes(1)
    expect(save).not.toHaveBeenCalled()
  })

  it('records confirmed delivery exactly once', async () => {
    send.mockResolvedValue('message-id')
    const result = await new NotificationController().save(request() as any, {} as any, jest.fn())
    expect(result.status).toBe('sent')
    expect(save).toHaveBeenCalledTimes(1)
    expect(send).toHaveBeenCalledTimes(1)
  })
})
