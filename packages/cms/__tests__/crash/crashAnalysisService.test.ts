jest.mock('../../src/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('typeorm', () => ({
  getConnection: jest.fn(),
}))

describe('CrashAnalysisService', () => {
  let service: any

  beforeEach(() => {
    jest.isolateModules(() => {
      jest.mock('../../src/logger', () => ({
        logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
      }))
      jest.mock('typeorm', () => ({ getConnection: jest.fn() }))
      const mod = require('../../src/services/crashAnalysisService')
      service = mod.crashAnalysisService
    })
  })

  afterEach(() => {
    if (service?.stopMemorySampling) {
      service.stopMemorySampling()
    }
  })

  describe('Exception Tracking', () => {
    it('records and retrieves exceptions', () => {
      service.recordException('POST', '/articles', new Error('Test error'), 500, {
        controller: 'ArticleController',
        action: 'save',
      })

      const recent = service.getRecentExceptions(10)
      expect(recent).toHaveLength(1)
      expect(recent[0].method).toBe('POST')
      expect(recent[0].url).toBe('/articles')
      expect(recent[0].message).toBe('Test error')
      expect(recent[0].statusCode).toBe(500)
      expect(recent[0].controller).toBe('ArticleController')
    })

    it('groups exceptions by message in topErrors', () => {
      service.recordException('POST', '/articles', new Error('Validation failed'), 500)
      service.recordException('POST', '/articles', new Error('Validation failed'), 500)
      service.recordException('GET', '/quiz', new Error('Not found'), 404)

      const topErrors = service.getTopErrors(10)
      expect(topErrors).toHaveLength(2)
      expect(topErrors[0].message).toBe('Validation failed')
      expect(topErrors[0].count).toBe(2)
    })

    it('returns exceptions in reverse chronological order', () => {
      service.recordException('GET', '/first', new Error('Error 1'), 500)
      service.recordException('GET', '/second', new Error('Error 2'), 500)

      const recent = service.getRecentExceptions(10)
      expect(recent[0].url).toBe('/second')
      expect(recent[1].url).toBe('/first')
    })

    it('respects the limit parameter', () => {
      for (let i = 0; i < 10; i++) {
        service.recordException('GET', `/route-${i}`, new Error(`Error ${i}`), 500)
      }

      const recent = service.getRecentExceptions(3)
      expect(recent).toHaveLength(3)
    })
  })

  describe('Request Tracking', () => {
    it('tracks request stats per route', () => {
      service.recordRequest('GET', '/articles', 200, 50)
      service.recordRequest('GET', '/articles', 200, 30)
      service.recordRequest('GET', '/articles', 500, 100)

      const highLoad = service.getHighLoadEndpoints(10)
      expect(highLoad.length).toBeGreaterThan(0)
      expect(highLoad[0].totalRequests).toBe(3)
    })

    it('tracks failing endpoints', () => {
      // Need at least minRequests (5) to appear in failing list
      for (let i = 0; i < 8; i++) {
        service.recordRequest('POST', '/articles', i < 3 ? 500 : 200, 100)
      }
      // Also record exceptions for the failures
      for (let i = 0; i < 3; i++) {
        service.recordException('POST', '/articles', new Error('Save failed'), 500)
      }

      const failing = service.getFailingEndpoints()
      expect(failing.length).toBeGreaterThan(0)
      const articleEndpoint = failing.find((e: any) => e.route.includes('/articles'))
      expect(articleEndpoint).toBeDefined()
      expect(articleEndpoint.failedRequests).toBe(3)
    })

    it('normalises UUIDs in route paths', () => {
      service.recordRequest('GET', '/articles/550e8400-e29b-41d4-a716-446655440000', 200, 50)
      service.recordRequest('GET', '/articles/a1b2c3d4-e5f6-7890-abcd-ef1234567890', 200, 60)

      const highLoad = service.getHighLoadEndpoints(10)
      const articleRoute = highLoad.find((e: any) => e.route.includes('/articles'))
      expect(articleRoute).toBeDefined()
      expect(articleRoute.totalRequests).toBe(2)
      expect(articleRoute.route).toContain(':id')
    })
  })

  describe('Timeout Tracking', () => {
    it('records timeouts', () => {
      service.recordTimeout('GET', '/data/generate-content-sheet', 15000)

      const recent = service.getRecentTimeouts(10)
      expect(recent).toHaveLength(1)
      expect(recent[0].duration).toBe(15000)
    })

    it('identifies timeout hotspots', () => {
      service.recordTimeout('GET', '/data/generate-content-sheet', 12000)
      service.recordTimeout('GET', '/data/generate-content-sheet', 15000)
      service.recordTimeout('GET', '/quiz', 11000)

      const hotspots = service.getTimeoutHotspots(10)
      expect(hotspots[0].route).toContain('generate-content-sheet')
      expect(hotspots[0].count).toBe(2)
    })

    it('returns timeout threshold', () => {
      expect(service.getTimeoutThreshold()).toBe(10000)
    })
  })

  describe('Memory Tracking', () => {
    it('returns current memory snapshot', () => {
      const mem = service.getCurrentMemory()
      expect(mem).toBeDefined()
      expect(mem.rss).toBeGreaterThan(0)
      expect(mem.heapUsed).toBeGreaterThan(0)
      expect(mem.heapUsedPercent).toBeGreaterThanOrEqual(0)
      expect(mem.heapUsedPercent).toBeLessThanOrEqual(100)
      expect(mem.rssFormatted).toBeDefined()
    })

    it('detects stable memory trend with insufficient data', () => {
      expect(service.getMemoryTrend()).toBe('stable')
    })
  })

  describe('Full Report', () => {
    it('generates comprehensive crash report', async () => {
      service.recordException('GET', '/test', new Error('Test'), 500)
      service.recordTimeout('GET', '/slow', 15000)

      const report = await service.generateReport()
      expect(report.generatedAt).toBeDefined()
      expect(report.uptime).toBeGreaterThanOrEqual(0)
      expect(report.summary).toBeDefined()
      expect(report.summary.totalExceptions).toBe(1)
      expect(report.summary.totalTimeouts).toBe(1)
      expect(report.exceptions.recent).toHaveLength(1)
      expect(report.memory.current).toBeDefined()
      expect(report.system.platform).toBeDefined()
      expect(report.system.nodeVersion).toBeDefined()
    })
  })
})
