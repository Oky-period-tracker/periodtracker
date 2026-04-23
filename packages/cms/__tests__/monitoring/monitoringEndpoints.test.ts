import express from 'express'
import request from 'supertest'
import { MonitoringController } from '../../src/controller/MonitoringController'

// Mock monitoringService
jest.mock('../../src/services/monitoringService', () => {
  const mock = {
    getHealthStatus: jest.fn(),
    getOverviewMetrics: jest.fn(),
    getRouteMetrics: jest.fn(),
    getSlowestRoutes: jest.fn(),
    recordResponseTime: jest.fn(),
  }
  return { monitoringService: mock }
})

jest.mock('../../src/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

import { monitoringService } from '../../src/services/monitoringService'

const mockedService = monitoringService as jest.Mocked<typeof monitoringService>

function createApp() {
  const app = express()
  const controller = new MonitoringController()
  app.get('/monitoring/health', (req, res, next) => controller.health(req, res, next))
  app.get('/monitoring/metrics', (req, res, next) => controller.metrics(req, res, next))
  app.get('/monitoring/routes', (req, res, next) => controller.routes(req, res, next))
  app.get('/monitoring/slow-routes', (req, res, next) => controller.slowRoutes(req, res, next))
  return app
}

describe('Monitoring Endpoints', () => {
  let app: express.Application

  beforeAll(() => {
    app = createApp()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /monitoring/health', () => {
    it('returns 200 when healthy', async () => {
      mockedService.getHealthStatus.mockResolvedValue({
        status: 'healthy',
        uptime: 3600,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        checks: {
          database: { status: 'connected', latency: 3 },
          memory: { status: 'ok', usage: process.memoryUsage(), heapUsedPercent: 50 },
          cpu: { loadAvg: [1.0, 0.8, 0.6], cpuCount: 4 },
        },
      })

      const res = await request(app).get('/monitoring/health')
      expect(res.status).toBe(200)
      expect(res.body.status).toBe('healthy')
      expect(res.body.checks.database.status).toBe('connected')
    })

    it('returns 503 when unhealthy', async () => {
      mockedService.getHealthStatus.mockResolvedValue({
        status: 'unhealthy',
        uptime: 100,
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        checks: {
          database: { status: 'disconnected' },
          memory: { status: 'ok', usage: process.memoryUsage(), heapUsedPercent: 50 },
          cpu: { loadAvg: [1.0, 0.8, 0.6], cpuCount: 4 },
        },
      })

      const res = await request(app).get('/monitoring/health')
      expect(res.status).toBe(503)
      expect(res.body.status).toBe('unhealthy')
    })

    it('returns 503 when health check throws', async () => {
      mockedService.getHealthStatus.mockRejectedValue(new Error('check failed'))

      const res = await request(app).get('/monitoring/health')
      expect(res.status).toBe(503)
      expect(res.body.error).toBe('Health check failed')
    })
  })

  describe('GET /monitoring/metrics', () => {
    it('returns metrics overview', async () => {
      const mockMetrics = {
        uptime: 3600,
        totalRequests: 1000,
        totalErrors: 5,
        errorRate: 0.5,
        statusCodeCounts: { 200: 990, 500: 5, 404: 5 },
        responseTime: { window: '1h', sampleCount: 1000, avg: 45, p50: 32, p95: 120, p99: 450, min: 1, max: 3200 },
      }
      mockedService.getOverviewMetrics.mockReturnValue(mockMetrics)

      const res = await request(app).get('/monitoring/metrics')
      expect(res.status).toBe(200)
      expect(res.body.totalRequests).toBe(1000)
      expect(res.body.errorRate).toBe(0.5)
      expect(res.body.responseTime.p95).toBe(120)
    })

    it('returns 500 when metrics fail', async () => {
      mockedService.getOverviewMetrics.mockImplementation(() => {
        throw new Error('metrics error')
      })

      const res = await request(app).get('/monitoring/metrics')
      expect(res.status).toBe(500)
    })
  })

  describe('GET /monitoring/routes', () => {
    it('returns per-route metrics', async () => {
      mockedService.getRouteMetrics.mockReturnValue({
        'GET /articles': {
          count: 100,
          totalDuration: 4500,
          avgDuration: 45,
          minDuration: 5,
          maxDuration: 320,
          statusCodes: { 200: 98, 500: 2 },
        },
      })

      const res = await request(app).get('/monitoring/routes')
      expect(res.status).toBe(200)
      expect(res.body['GET /articles']).toBeDefined()
      expect(res.body['GET /articles'].count).toBe(100)
    })
  })

  describe('GET /monitoring/slow-routes', () => {
    it('returns slowest routes array', async () => {
      mockedService.getSlowestRoutes.mockReturnValue([
        { route: 'GET /data/generate-content-sheet', avgDuration: 2500, maxDuration: 8200, count: 5 },
        { route: 'POST /articles', avgDuration: 200, maxDuration: 900, count: 50 },
      ])

      const res = await request(app).get('/monitoring/slow-routes')
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body)).toBe(true)
      expect(res.body[0].avgDuration).toBe(2500)
    })
  })
})
