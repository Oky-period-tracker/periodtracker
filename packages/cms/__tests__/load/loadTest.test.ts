import express, { Request, Response, NextFunction } from 'express'
import request from 'supertest'
import { crashDetector } from '../../src/middleware/crashDetector'
import { requestTimeout } from '../../src/middleware/requestTimeout'
import { responseTimeTracker } from '../../src/middleware/responseTimeTracker'
import { errorLogger } from '../../src/middleware/errorLogger'

// Mock dependencies
jest.mock('../../src/services/crashAnalysisService', () => ({
  crashAnalysisService: {
    recordRequest: jest.fn(),
    recordTimeout: jest.fn(),
    recordException: jest.fn(),
    getTimeoutThreshold: jest.fn().mockReturnValue(60000),
  },
}))

jest.mock('../../src/services/monitoringService', () => ({
  monitoringService: {
    recordResponseTime: jest.fn(),
  },
}))

jest.mock('../../src/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

/**
 * Creates a minimal Express app with the same middleware stack as the CMS.
 * Routes simulate different response scenarios for load testing.
 */
function createLoadTestApp() {
  const app = express()

  // Middleware pipeline matching production order
  app.use(crashDetector)
  app.use(requestTimeout(10000))
  app.use(responseTimeTracker)

  app.use(express.json())

  // Fast endpoint
  app.get('/health/live', (_req, res) => res.json({ status: 'alive' }))

  // Simulated API endpoint
  app.get('/api/data', (_req, res) => res.json({ items: [1, 2, 3] }))

  // Simulated write endpoint
  app.post('/api/data', (req, res) => {
    if (!req.body?.name) {
      return res.status(400).json({ error: 'Name required' })
    }
    res.status(201).json({ id: 1, name: req.body.name })
  })

  // Endpoint that throws errors
  app.get('/api/unstable', (_req: Request, _res: Response) => {
    throw new Error('Intentional error')
  })

  // Error handler
  app.use(errorLogger)

  return app
}

describe('Basic Load Testing', () => {
  let app: express.Application

  beforeAll(() => {
    app = createLoadTestApp()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Concurrent GET requests', () => {
    it('handles 50 concurrent health check requests', async () => {
      const concurrency = 50
      const requests = Array.from({ length: concurrency }, () =>
        request(app).get('/health/live'),
      )

      const responses = await Promise.all(requests)

      const successCount = responses.filter((r) => r.status === 200).length
      expect(successCount).toBe(concurrency)

      // All should return alive
      responses.forEach((res) => {
        expect(res.body.status).toBe('alive')
      })
    })

    it('handles 50 concurrent API data requests', async () => {
      const concurrency = 50
      const requests = Array.from({ length: concurrency }, () =>
        request(app).get('/api/data'),
      )

      const responses = await Promise.all(requests)

      const successCount = responses.filter((r) => r.status === 200).length
      expect(successCount).toBe(concurrency)
    })

    it('handles 100 concurrent mixed requests', async () => {
      const requests = [
        ...Array.from({ length: 40 }, () => request(app).get('/health/live')),
        ...Array.from({ length: 40 }, () => request(app).get('/api/data')),
        ...Array.from({ length: 20 }, () =>
          request(app).post('/api/data').send({ name: 'test' }).set('Content-Type', 'application/json'),
        ),
      ]

      const responses = await Promise.all(requests)

      const status200 = responses.filter((r) => r.status === 200).length
      const status201 = responses.filter((r) => r.status === 201).length

      expect(status200).toBe(80) // 40 health + 40 data
      expect(status201).toBe(20) // 20 POST creates
    })
  })

  describe('Concurrent POST requests', () => {
    it('handles 30 concurrent write requests', async () => {
      const concurrency = 30
      const requests = Array.from({ length: concurrency }, (_, i) =>
        request(app)
          .post('/api/data')
          .send({ name: `item-${i}` })
          .set('Content-Type', 'application/json'),
      )

      const responses = await Promise.all(requests)
      const successCount = responses.filter((r) => r.status === 201).length
      expect(successCount).toBe(concurrency)
    })

    it('returns 400 for invalid POST requests under load', async () => {
      const concurrency = 20
      const requests = Array.from({ length: concurrency }, () =>
        request(app)
          .post('/api/data')
          .send({})
          .set('Content-Type', 'application/json'),
      )

      const responses = await Promise.all(requests)
      const badRequests = responses.filter((r) => r.status === 400).length
      expect(badRequests).toBe(concurrency)
    })
  })

  describe('Error handling under load', () => {
    it('handles 20 concurrent error-generating requests gracefully', async () => {
      const concurrency = 20
      const requests = Array.from({ length: concurrency }, () =>
        request(app).get('/api/unstable').set('Accept', 'application/json'),
      )

      const responses = await Promise.all(requests)

      // All should return 500, none should crash the server
      const errorCount = responses.filter((r) => r.status === 500).length
      expect(errorCount).toBe(concurrency)

      // Server is still responsive after errors
      const healthRes = await request(app).get('/health/live')
      expect(healthRes.status).toBe(200)
    })

    it('mixes successful and failing requests without affecting each other', async () => {
      const requests = [
        ...Array.from({ length: 15 }, () => request(app).get('/api/data')),
        ...Array.from({ length: 10 }, () =>
          request(app).get('/api/unstable').set('Accept', 'application/json'),
        ),
        ...Array.from({ length: 15 }, () => request(app).get('/api/data')),
      ]

      const responses = await Promise.all(requests)

      const successCount = responses.filter((r) => r.status === 200).length
      const errorCount = responses.filter((r) => r.status === 500).length

      expect(successCount).toBe(30) // 15 + 15 successful
      expect(errorCount).toBe(10) // 10 errors
    })
  })

  describe('Response time consistency', () => {
    it('maintains consistent response times under moderate load', async () => {
      const concurrency = 30
      const startTime = Date.now()

      const requests = Array.from({ length: concurrency }, () =>
        request(app).get('/health/live'),
      )

      await Promise.all(requests)

      const totalTime = Date.now() - startTime
      // 30 concurrent in-memory responses should complete quickly
      expect(totalTime).toBeLessThan(5000)
    })
  })
})
