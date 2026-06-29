import express, { Request, Response, NextFunction } from 'express'
import request from 'supertest'
import { errorLogger } from '../../src/middleware/errorLogger'

jest.mock('../../src/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

function createApp(opts?: { routeAcceptHeader?: string }) {
  const app = express()

  app.get('/crash', () => {
    throw new Error('Deliberate crash')
  })

  app.get('/async-crash', async () => {
    throw new Error('Async crash')
  })

  app.use(errorLogger)

  return app
}

describe('errorLogger middleware', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Response format', () => {
    it('returns JSON for API requests (Accept: application/json)', async () => {
      const app = createApp()

      const res = await request(app)
        .get('/crash')
        .set('Accept', 'application/json')

      expect(res.status).toBe(500)
      expect(res.body.error).toBe('Internal server error')
    })

    it('returns JSON for mobile API requests', async () => {
      const app = express()
      app.get('/mobile/articles/en', () => {
        throw new Error('Mobile crash')
      })
      app.use(errorLogger)

      const res = await request(app).get('/mobile/articles/en')

      expect(res.status).toBe(500)
      expect(res.body.error).toBe('Internal server error')
    })

    it('returns text for web requests', async () => {
      const app = createApp()

      const res = await request(app)
        .get('/crash')
        .set('Accept', 'text/html')

      expect(res.status).toBe(500)
      expect(res.text).toBe('Internal server error')
    })
  })

  describe('Headers sent guard', () => {
    it('does not crash when headers already sent', async () => {
      const app = express()
      app.get('/partial', (_req: Request, res: Response, next: NextFunction) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end('partial data')
        // Simulate an error after headers are sent
        next(new Error('After headers sent'))
      })
      app.use(errorLogger)

      const res = await request(app).get('/partial')
      expect(res.status).toBe(200)
    })
  })

  describe('Error logging', () => {
    it('logs error details', async () => {
      const { logger } = require('../../src/logger')
      const app = createApp()

      await request(app)
        .get('/crash')
        .set('Accept', 'application/json')

      expect(logger.error).toHaveBeenCalledWith(
        'Unhandled error',
        expect.objectContaining({
          message: 'Deliberate crash',
          method: 'GET',
          url: '/crash',
        }),
      )
    })
  })

  describe('Async error handling', () => {
    it('handles async route errors', async () => {
      const app = express()
      app.get('/async-crash', (_req: Request, _res: Response, next: NextFunction) => {
        Promise.reject(new Error('Async crash')).catch(next)
      })
      app.use(errorLogger)

      const res = await request(app)
        .get('/async-crash')
        .set('Accept', 'application/json')

      expect(res.status).toBe(500)
      expect(res.body.error).toBe('Internal server error')
    })
  })
})
