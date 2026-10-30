import express from 'express'
import http from 'http'
import { AddressInfo } from 'net'
import * as bodyParser from 'body-parser'
import request from 'supertest'
import {
  MOBILE_BODY_LIMIT,
  payloadTooLarge,
  rateLimit,
  singleFileUpload,
} from '../../src/middleware/requestLimits'

jest.mock('../../src/logger', () => ({
  logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}))

describe('body limit', () => {
  const handler = jest.fn((_req, res) => res.json({ ok: true }))
  const app = express()
  app.use('/mobile', bodyParser.json({ limit: MOBILE_BODY_LIMIT }))
  app.post('/mobile/suggestions', handler)
  app.use(payloadTooLarge)

  beforeEach(() => handler.mockClear())

  it('answers 413 to an oversized body without reaching the route', async () => {
    const res = await request(app)
      .post('/mobile/suggestions')
      .send({ content: 'x'.repeat(40 * 1024) })

    expect(res.status).toBe(413)
    expect(res.body).toEqual({ error: 'Payload too large' })
    expect(handler).not.toHaveBeenCalled()
  })

  it('answers 413 to an oversized body sent without a length', async () => {
    const server = app.listen(0)
    const { port } = server.address() as AddressInfo
    try {
      const status = await new Promise<number>((resolve, reject) => {
        const req = http.request({
          port,
          method: 'POST',
          path: '/mobile/suggestions',
          headers: { 'Content-Type': 'application/json', 'Transfer-Encoding': 'chunked' },
        })
        req.on('response', (res) => {
          res.resume()
          resolve(res.statusCode)
        })
        req.on('error', reject)
        req.write('{"content":"')
        for (let i = 0; i < 40; i++) req.write('x'.repeat(1024))
        req.end('"}')
      })

      expect(status).toBe(413)
      expect(handler).not.toHaveBeenCalled()
    } finally {
      server.close()
    }
  })

  it('lets a body under the limit through', async () => {
    const res = await request(app)
      .post('/mobile/suggestions')
      .send({ content: 'x'.repeat(5000) })

    expect(res.status).toBe(200)
    expect(handler).toHaveBeenCalledTimes(1)
  })
})

describe('upload limit', () => {
  const handler = jest.fn((req, res) => res.json({ size: req.file.size }))
  const app = express()
  app.post('/data/upload-content-sheet', singleFileUpload(1024).single('spreadsheet'), handler)
  app.use(payloadTooLarge)
  app.use((err, _req, res, _next) => res.status(500).send(err.message))

  beforeEach(() => handler.mockClear())

  it('answers 413 to a file over the limit without reaching the route', async () => {
    const res = await request(app)
      .post('/data/upload-content-sheet')
      .set('Accept', 'text/html')
      .attach('spreadsheet', Buffer.alloc(1025), 'content.xlsx')

    expect(res.status).toBe(413)
    expect(res.text).toBe('Payload too large')
    expect(handler).not.toHaveBeenCalled()
  })

  it('answers 413 to a second file', async () => {
    const res = await request(app)
      .post('/data/upload-content-sheet')
      .attach('spreadsheet', Buffer.alloc(10), 'one.xlsx')
      .attach('spreadsheet', Buffer.alloc(10), 'two.xlsx')

    expect(res.status).toBe(413)
    expect(handler).not.toHaveBeenCalled()
  })

  it('accepts a file within the limit', async () => {
    const res = await request(app)
      .post('/data/upload-content-sheet')
      .attach('spreadsheet', Buffer.alloc(1024), 'content.xlsx')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ size: 1024 })
  })

  it('leaves other errors to the next error handler', async () => {
    const res = await request(app)
      .post('/data/upload-content-sheet')
      .attach('wrongField', Buffer.alloc(10), 'content.xlsx')

    expect(res.status).toBe(500)
    expect(res.text).toBe('Unexpected field')
  })
})

describe('rateLimit', () => {
  let now: number

  const createApp = (maxClients?: number) => {
    const app = express()
    app.set('trust proxy', true)
    app.post('/mobile/suggestions', rateLimit({ windowMs: 60000, max: 2, maxClients }))
    app.post('/mobile/suggestions', (_req, res) => res.json({ ok: true }))
    return app
  }
  const post = (app: express.Express, ip: string) =>
    request(app).post('/mobile/suggestions').set('X-Forwarded-For', ip)

  beforeEach(() => {
    now = 1000000
    jest.spyOn(Date, 'now').mockImplementation(() => now)
  })

  afterEach(() => jest.restoreAllMocks())

  it('answers 429 once a client used its requests, until the window ends', async () => {
    const app = createApp()

    expect((await post(app, '10.0.0.1')).status).toBe(200)
    expect((await post(app, '10.0.0.1')).status).toBe(200)
    const limited = await post(app, '10.0.0.1')
    expect(limited.status).toBe(429)
    expect(limited.body).toEqual({ error: 'Too many requests' })
    expect(limited.headers['retry-after']).toBe('60')

    now += 59000
    expect((await post(app, '10.0.0.1')).status).toBe(429)
    now += 1000
    expect((await post(app, '10.0.0.1')).status).toBe(200)
  })

  it('counts each client IP on its own', async () => {
    const app = createApp()

    await post(app, '10.0.0.1')
    await post(app, '10.0.0.1')

    expect((await post(app, '10.0.0.1')).status).toBe(429)
    expect((await post(app, '10.0.0.2')).status).toBe(200)
  })

  it('forgets the oldest client rather than tracking more than maxClients', async () => {
    const app = createApp(1)

    await post(app, '10.0.0.1')
    await post(app, '10.0.0.1')
    expect((await post(app, '10.0.0.1')).status).toBe(429)

    await post(app, '10.0.0.2')
    expect((await post(app, '10.0.0.1')).status).toBe(200)
  })
})
