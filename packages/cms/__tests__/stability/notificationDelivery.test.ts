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
  // Status of the row at the moment each save happened, in order.
  let savedStatuses: string[]
  const request = () => ({ body: { title: 'Test', content: 'Message' }, user: { lang: 'en' } })
  const response = () => {
    const res: any = { headersSent: false }
    res.status = jest.fn(() => res)
    res.send = jest.fn(() => res)
    return res
  }

  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
    savedStatuses = []
    save.mockImplementation(async (row) => {
      savedStatuses.push(row.status)
      return { ...row, id: row.id ?? 1 }
    })
    ;(getRepository as jest.Mock).mockReturnValue({ save, create: (row) => ({ ...row }) })
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
    const res = response()
    const result = new NotificationController().save(request() as any, res, jest.fn())
    await jest.advanceTimersByTimeAsync(16000)
    expect(send).toHaveBeenCalledTimes(1)
    complete!('delivered-late')
    await jest.advanceTimersByTimeAsync(60000)
    expect(await result).toBeUndefined()
    expect(send).toHaveBeenCalledTimes(1)
    expect(savedStatuses).toEqual(['unknown', 'unknown'])
    expect(res.status).toHaveBeenCalledWith(502)
    expect(res.send.mock.calls[0][0].status).toBe('unknown')
  })

  it('does not retry a rejected send or record it as sent', async () => {
    send.mockRejectedValue(new Error('Firebase unavailable'))
    const res = response()
    const result = new NotificationController().save(request() as any, res, jest.fn())
    await jest.advanceTimersByTimeAsync(60000)
    expect(await result).toBeUndefined()
    expect(send).toHaveBeenCalledTimes(1)
    expect(savedStatuses).toEqual(['unknown', 'failed'])
    expect(res.status).toHaveBeenCalledWith(502)
    expect(res.send.mock.calls[0][0].status).toBe('failed')
  })

  it('records confirmed delivery exactly once', async () => {
    send.mockResolvedValue('message-id')
    const res = response()
    const result = await new NotificationController().save(request() as any, res, jest.fn())
    expect(result.status).toBe('sent')
    expect(result.messageId).toBe('message-id')
    expect(send).toHaveBeenCalledTimes(1)
    expect(savedStatuses).toEqual(['unknown', 'sent'])
    expect(res.status).not.toHaveBeenCalled()
  })

  it('rejects a notification without a title or message before recording or sending it', async () => {
    const res = response()
    await new NotificationController().save(
      { body: { title: ' ', content: '' }, user: { lang: 'en' } } as any,
      res,
      jest.fn(),
    )
    expect(res.status).toHaveBeenCalledWith(400)
    expect(save).not.toHaveBeenCalled()
    expect(send).not.toHaveBeenCalled()
  })
})
