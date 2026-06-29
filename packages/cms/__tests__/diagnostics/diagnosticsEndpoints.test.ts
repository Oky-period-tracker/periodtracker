import express from 'express'
import request from 'supertest'
import { DiagnosticsController } from '../../src/controller/DiagnosticsController'

// Mock crashAnalysisService
jest.mock('../../src/services/crashAnalysisService', () => {
  const mock = {
    generateReport: jest.fn(),
    getRecentExceptions: jest.fn(),
    getTopErrors: jest.fn(),
    getCurrentMemory: jest.fn(),
    getMemorySpikes: jest.fn(),
    getMemoryTrend: jest.fn(),
    getRecentTimeouts: jest.fn(),
    getTimeoutHotspots: jest.fn(),
    getFailingEndpoints: jest.fn(),
    getHighLoadEndpoints: jest.fn(),
  }
  return { crashAnalysisService: mock }
})

jest.mock('../../src/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

import { crashAnalysisService } from '../../src/services/crashAnalysisService'

const mockedService = crashAnalysisService as jest.Mocked<typeof crashAnalysisService>

function createApp() {
  const app = express()
  const controller = new DiagnosticsController()
  app.get('/diagnostics/report', (req, res) => controller.report(req, res))
  app.get('/diagnostics/exceptions', (req, res) => controller.exceptions(req, res))
  app.get('/diagnostics/memory', (req, res) => controller.memory(req, res))
  app.get('/diagnostics/timeouts', (req, res) => controller.timeouts(req, res))
  app.get('/diagnostics/endpoints', (req, res) => controller.endpoints(req, res))
  return app
}

describe('Diagnostics Endpoints', () => {
  let app: express.Application

  beforeAll(() => {
    app = createApp()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /diagnostics/report', () => {
    it('returns full crash report', async () => {
      mockedService.generateReport.mockResolvedValue({
        generatedAt: new Date().toISOString(),
        uptime: 3600,
        summary: {
          totalExceptions: 5,
          totalTimeouts: 2,
          memorySpikesDetected: 0,
          unhealthyEndpoints: 1,
        },
        exceptions: { recent: [], topErrors: [] },
        memory: {
          current: {
            timestamp: new Date().toISOString(),
            rss: 80000000,
            heapTotal: 60000000,
            heapUsed: 40000000,
            external: 1000000,
            heapUsedPercent: 67,
            rssFormatted: '76.3 MB',
            heapUsedFormatted: '38.1 MB',
          },
          spikes: [],
          trend: 'stable',
        },
        timeouts: { recent: [], topRoutes: [] },
        failingEndpoints: [],
        system: {
          loadAvg: [1.0, 0.8, 0.6],
          cpuCount: 4,
          freeMemory: 2000000000,
          totalMemory: 8000000000,
          platform: 'darwin',
          nodeVersion: process.version,
        },
      })

      const res = await request(app).get('/diagnostics/report')
      expect(res.status).toBe(200)
      expect(res.body.summary).toBeDefined()
      expect(res.body.summary.totalExceptions).toBe(5)
      expect(res.body.memory.trend).toBe('stable')
      expect(res.body.system.cpuCount).toBe(4)
    })

    it('returns 500 when report generation fails', async () => {
      mockedService.generateReport.mockRejectedValue(new Error('report error'))

      const res = await request(app).get('/diagnostics/report')
      expect(res.status).toBe(500)
      expect(res.body.error).toBe('Failed to generate crash report')
    })
  })

  describe('GET /diagnostics/exceptions', () => {
    it('returns recent exceptions and top errors', async () => {
      mockedService.getRecentExceptions.mockReturnValue([
        {
          timestamp: new Date().toISOString(),
          method: 'POST',
          url: '/articles',
          message: 'Validation error',
          statusCode: 500,
        },
      ])
      mockedService.getTopErrors.mockReturnValue([
        { message: 'Validation error', count: 3, lastSeen: new Date().toISOString() },
      ])

      const res = await request(app).get('/diagnostics/exceptions')
      expect(res.status).toBe(200)
      expect(res.body.recent).toHaveLength(1)
      expect(res.body.topErrors).toHaveLength(1)
      expect(res.body.topErrors[0].count).toBe(3)
    })
  })

  describe('GET /diagnostics/memory', () => {
    it('returns memory data with trend', async () => {
      mockedService.getCurrentMemory.mockReturnValue({
        timestamp: new Date().toISOString(),
        rss: 80000000,
        heapTotal: 60000000,
        heapUsed: 40000000,
        external: 1000000,
        heapUsedPercent: 67,
        rssFormatted: '76.3 MB',
        heapUsedFormatted: '38.1 MB',
      })
      mockedService.getMemorySpikes.mockReturnValue([])
      mockedService.getMemoryTrend.mockReturnValue('stable')

      const res = await request(app).get('/diagnostics/memory')
      expect(res.status).toBe(200)
      expect(res.body.current.heapUsedPercent).toBe(67)
      expect(res.body.spikes).toEqual([])
      expect(res.body.trend).toBe('stable')
    })
  })

  describe('GET /diagnostics/timeouts', () => {
    it('returns timeout data with hotspots', async () => {
      mockedService.getRecentTimeouts.mockReturnValue([
        {
          timestamp: new Date().toISOString(),
          method: 'GET',
          url: '/data/generate-content-sheet',
          duration: 15000,
          threshold: 10000,
        },
      ])
      mockedService.getTimeoutHotspots.mockReturnValue([
        { route: 'GET /data/generate-content-sheet', count: 3, avgDuration: 12500 },
      ])

      const res = await request(app).get('/diagnostics/timeouts')
      expect(res.status).toBe(200)
      expect(res.body.recent).toHaveLength(1)
      expect(res.body.hotspots[0].route).toBe('GET /data/generate-content-sheet')
    })
  })

  describe('GET /diagnostics/endpoints', () => {
    it('returns failing and high-load endpoints', async () => {
      mockedService.getFailingEndpoints.mockReturnValue([
        {
          route: 'POST /articles',
          totalRequests: 50,
          failedRequests: 5,
          failureRate: 10,
          avgDuration: 230,
          maxDuration: 1500,
          errors: [{ message: 'Validation failed', count: 5 }],
        },
      ])
      mockedService.getHighLoadEndpoints.mockReturnValue([
        { route: 'GET /encyclopedia', totalRequests: 5000, avgDuration: 45, failureRate: 0.02 },
      ])

      const res = await request(app).get('/diagnostics/endpoints')
      expect(res.status).toBe(200)
      expect(res.body.failing).toHaveLength(1)
      expect(res.body.failing[0].failureRate).toBe(10)
      expect(res.body.highLoad).toHaveLength(1)
    })
  })
})
