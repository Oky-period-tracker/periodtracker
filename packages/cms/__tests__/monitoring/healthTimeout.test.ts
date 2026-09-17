jest.mock('typeorm', () => ({ getConnection: jest.fn() }))
jest.mock('../../src/logger', () => ({ logger: { error: jest.fn() } }))

import { getConnection } from 'typeorm'
import { monitoringService } from '../../src/services/monitoringService'
import { MonitoringController } from '../../src/controller/MonitoringController'
import { requestTimeout } from '../../src/middleware/requestTimeout'
import { EventEmitter } from 'events'

describe('Monitoring health deadlines', () => {
  beforeEach(() => jest.useFakeTimers({ doNotFake: ['setImmediate'] }))
  afterEach(() => { jest.restoreAllMocks(); jest.useRealTimers() })

  it('reports unhealthy within five seconds when the database stalls', async () => {
    let finish: (value: any) => void
    const query = jest.fn(() => new Promise(resolve => { finish = resolve }))
    ;(getConnection as jest.Mock).mockReturnValue({ isConnected: true, query })
    const health = monitoringService.getHealthStatus()
    jest.advanceTimersByTime(5000)
    // Race prevents a broken deadline from leaving this test hanging.
    const result: any = await Promise.race([health, new Promise(resolve => setImmediate(() => resolve('pending')))])
    expect(result).toEqual(expect.objectContaining({ status: 'unhealthy' }))
    expect(result.checks.database.error).toContain('timed out')
    finish!([])
    await Promise.resolve()
  })

  it('still reports a successful database check', async () => {
    ;(getConnection as jest.Mock).mockReturnValue({ isConnected: true, query: jest.fn().mockResolvedValue([]) })
    const health = await monitoringService.getHealthStatus()
    expect(health.checks.database.status).toBe('connected')
    expect(jest.getTimerCount()).toBe(0)
  })

  it('reports disconnected and rejected database checks as unhealthy', async () => {
    const query = jest.fn().mockRejectedValue(new Error('database unavailable'))
    ;(getConnection as jest.Mock).mockReturnValue({ isConnected: false, query })
    expect((await monitoringService.getHealthStatus()).status).toBe('unhealthy')
    expect(query).not.toHaveBeenCalled()
    ;(getConnection as jest.Mock).mockReturnValue({ isConnected: true, query })
    const health = await monitoringService.getHealthStatus()
    expect(health.status).toBe('unhealthy')
    expect(health.checks.database.error).toBe('database unavailable')
    expect(jest.getTimerCount()).toBe(0)
  })

  it('does not write after the client disconnects', async () => {
    jest.spyOn(monitoringService, 'getHealthStatus').mockResolvedValue({ status: 'healthy' } as any)
    const res: any = { headersSent: false, destroyed: true, status: jest.fn(), json: jest.fn() }
    await new MonitoringController().health({} as any, res, jest.fn())
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })

  it.each(['resolve', 'reject'])('does not write again when a timed-out check later %ss', async outcome => {
    let resolve: (value: any) => void
    let reject: (reason: Error) => void
    jest.spyOn(monitoringService, 'getHealthStatus').mockImplementation(() => new Promise((yes, no) => {
      resolve = yes; reject = no
    }))
    const res: any = new EventEmitter()
    res.headersSent = false
    res.status = jest.fn(() => res)
    res.json = jest.fn(() => {
      if (res.headersSent) throw new Error('second response')
      res.headersSent = true
      res.emit('finish')
      return res
    })
    const req: any = { method: 'GET', originalUrl: '/monitoring/health' }
    const next = jest.fn()
    requestTimeout(10)(req, res, next)
    const pending = new MonitoringController().health(req, res, next)
    jest.advanceTimersByTime(10)
    if (outcome === 'resolve') resolve!({ status: 'healthy' })
    else reject!(new Error('late database failure'))
    await expect(pending).resolves.toBeUndefined()
    expect(res.json).toHaveBeenCalledTimes(1)
    expect(res.status).toHaveBeenCalledWith(503)
  })
})
