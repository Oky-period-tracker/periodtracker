import express from 'express'
import request from 'supertest'
import { requestTimeout } from '../../src/middleware/requestTimeout'

jest.mock('../../src/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

describe('requestTimeout middleware', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('allows fast requests through without timeout', async () => {
    const app = express()
    app.use(requestTimeout(5000))
    app.get('/fast', (_req, res) => res.json({ ok: true }))

    const res = await request(app).get('/fast')
    expect(res.status).toBe(200)
    expect(res.body.ok).toBe(true)
  })

  it('returns 503 when request exceeds timeout', async () => {
    const app = express()
    app.use(requestTimeout(50)) // 50ms timeout
    app.get('/slow', (_req, res) => {
      setTimeout(() => {
        if (!res.headersSent) {
          res.json({ ok: true })
        }
      }, 200)
    })

    const res = await request(app).get('/slow')
    expect(res.status).toBe(503)
    expect(res.body.error).toBe('Request timed out')
  })

  it('clears timer when response finishes normally', async () => {
    const app = express()
    app.use(requestTimeout(5000))
    app.get('/normal', (_req, res) => res.json({ ok: true }))

    // Should complete without issues — timer is cleared
    const res = await request(app).get('/normal')
    expect(res.status).toBe(200)
  })

  it('uses default timeout when no parameter given', async () => {
    const app = express()
    app.use(requestTimeout()) // defaults to DEFAULT_REQUEST_TIMEOUT (60s)
    app.get('/default', (_req, res) => res.json({ ok: true }))

    const res = await request(app).get('/default')
    expect(res.status).toBe(200)
  })

  it('logs timeout event', async () => {
    const { logger } = require('../../src/logger')
    const app = express()
    app.use(requestTimeout(30))
    app.get('/log-test', (_req, res) => {
      setTimeout(() => {
        if (!res.headersSent) {
          res.json({ late: true })
        }
      }, 200)
    })

    await request(app).get('/log-test')

    expect(logger.error).toHaveBeenCalledWith(
      'Request timeout',
      expect.objectContaining({
        method: 'GET',
        url: '/log-test',
        timeoutMs: 30,
      }),
    )
  })
})
