import express from 'express'
import request from 'supertest'
import { HealthController } from '../../src/controller/HealthController'

// Mock healthCheckService
jest.mock('../../src/services/healthCheckService', () => {
  const mock = {
    getHealth: jest.fn(),
    isReady: jest.fn(),
  }
  return { healthCheckService: mock }
})

// Mock logger
jest.mock('../../src/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

import { healthCheckService } from '../../src/services/healthCheckService'

const mockedHealthService = healthCheckService as jest.Mocked<typeof healthCheckService>

function createApp() {
  const app = express()
  const controller = new HealthController()
  app.get('/health', (req, res) => controller.health(req, res))
  app.get('/health/live', (req, res) => controller.live(req, res))
  app.get('/health/ready', (req, res) => controller.ready(req, res))
  return app
}

describe('Health Check Endpoints', () => {
  let app: express.Application

  beforeAll(() => {
    app = createApp()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /health', () => {
    it('returns 200 when healthy', async () => {
      mockedHealthService.getHealth.mockResolvedValue({
        status: 'healthy',
        uptime: 100,
        timestamp: new Date().toISOString(),
        checks: {
          database: { status: 'up', latency: 3, lastChecked: new Date().toISOString() },
          service: { status: 'up', lastChecked: new Date().toISOString() },
        },
      })

      const res = await request(app).get('/health')
      expect(res.status).toBe(200)
      expect(res.body.status).toBe('healthy')
      expect(res.body.checks.database.status).toBe('up')
      expect(res.body.checks.service.status).toBe('up')
    })

    it('returns 200 when degraded', async () => {
      mockedHealthService.getHealth.mockResolvedValue({
        status: 'degraded',
        uptime: 100,
        timestamp: new Date().toISOString(),
        checks: {
          database: { status: 'up', latency: 1500, lastChecked: new Date().toISOString() },
          service: { status: 'up', lastChecked: new Date().toISOString() },
        },
      })

      const res = await request(app).get('/health')
      expect(res.status).toBe(200)
      expect(res.body.status).toBe('degraded')
    })

    it('returns 503 when unhealthy', async () => {
      mockedHealthService.getHealth.mockResolvedValue({
        status: 'unhealthy',
        uptime: 100,
        timestamp: new Date().toISOString(),
        checks: {
          database: { status: 'down', error: 'Connection refused', lastChecked: new Date().toISOString() },
          service: { status: 'up', lastChecked: new Date().toISOString() },
        },
      })

      const res = await request(app).get('/health')
      expect(res.status).toBe(503)
      expect(res.body.status).toBe('unhealthy')
    })

    it('returns 503 when health check throws', async () => {
      mockedHealthService.getHealth.mockRejectedValue(new Error('DB gone'))

      const res = await request(app).get('/health')
      expect(res.status).toBe(503)
      expect(res.body.status).toBe('unhealthy')
      expect(res.body.error).toBe('Health check failed')
    })
  })

  describe('GET /health/live', () => {
    it('always returns 200 with alive status', async () => {
      const res = await request(app).get('/health/live')
      expect(res.status).toBe(200)
      expect(res.body.status).toBe('alive')
    })
  })

  describe('GET /health/ready', () => {
    it('returns 200 when ready', async () => {
      mockedHealthService.isReady.mockResolvedValue(true)

      const res = await request(app).get('/health/ready')
      expect(res.status).toBe(200)
      expect(res.body.status).toBe('ready')
    })

    it('returns 503 when not ready', async () => {
      mockedHealthService.isReady.mockResolvedValue(false)

      const res = await request(app).get('/health/ready')
      expect(res.status).toBe(503)
      expect(res.body.status).toBe('not_ready')
    })

    it('returns 503 when readiness check throws', async () => {
      mockedHealthService.isReady.mockRejectedValue(new Error('check failed'))

      const res = await request(app).get('/health/ready')
      expect(res.status).toBe(503)
      expect(res.body.status).toBe('not_ready')
    })
  })
})
