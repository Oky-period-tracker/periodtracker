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

describe('MonitoringService', () => {
  let service: any

  beforeEach(() => {
    jest.isolateModules(() => {
      jest.mock('../../src/logger', () => ({
        logger: { info: jest.fn(), warn: jest.fn(), error: jest.fn() },
      }))
      jest.mock('typeorm', () => ({ getConnection: jest.fn() }))
      const mod = require('../../src/services/monitoringService')
      service = mod.monitoringService
    })
  })

  describe('Response Time Recording', () => {
    it('records and counts requests', () => {
      service.recordResponseTime('GET', '/articles', 200, 50)
      service.recordResponseTime('GET', '/articles', 200, 30)
      service.recordResponseTime('POST', '/articles', 201, 100)

      const metrics = service.getOverviewMetrics()
      expect(metrics.totalRequests).toBe(3)
      expect(metrics.totalErrors).toBe(0)
    })

    it('tracks error count for 5xx responses', () => {
      service.recordResponseTime('GET', '/articles', 200, 50)
      service.recordResponseTime('GET', '/fail', 500, 100)
      service.recordResponseTime('GET', '/fail', 502, 200)

      const metrics = service.getOverviewMetrics()
      expect(metrics.totalErrors).toBe(2)
      expect(metrics.errorRate).toBeGreaterThan(0)
    })

    it('tracks status code distribution', () => {
      service.recordResponseTime('GET', '/a', 200, 10)
      service.recordResponseTime('GET', '/b', 200, 20)
      service.recordResponseTime('GET', '/c', 404, 15)
      service.recordResponseTime('GET', '/d', 500, 100)

      const metrics = service.getOverviewMetrics()
      expect(metrics.statusCodeCounts[200]).toBe(2)
      expect(metrics.statusCodeCounts[404]).toBe(1)
      expect(metrics.statusCodeCounts[500]).toBe(1)
    })
  })

  describe('Route Metrics', () => {
    it('calculates per-route metrics', () => {
      service.recordResponseTime('GET', '/articles', 200, 50)
      service.recordResponseTime('GET', '/articles', 200, 100)
      service.recordResponseTime('GET', '/articles', 500, 200)

      const routeMetrics = service.getRouteMetrics()
      const articleMetrics = routeMetrics['GET /articles']

      expect(articleMetrics).toBeDefined()
      expect(articleMetrics.count).toBe(3)
      expect(articleMetrics.minDuration).toBe(50)
      expect(articleMetrics.maxDuration).toBe(200)
      expect(articleMetrics.avgDuration).toBeGreaterThan(0)
    })

    it('aggregates status codes per route', () => {
      service.recordResponseTime('GET', '/quiz', 200, 10)
      service.recordResponseTime('GET', '/quiz', 200, 20)
      service.recordResponseTime('GET', '/quiz', 500, 100)

      const routeMetrics = service.getRouteMetrics()
      expect(routeMetrics['GET /quiz'].statusCodes[200]).toBe(2)
      expect(routeMetrics['GET /quiz'].statusCodes[500]).toBe(1)
    })
  })

  describe('Slowest Routes', () => {
    it('returns routes sorted by average duration', () => {
      service.recordResponseTime('GET', '/fast', 200, 10)
      service.recordResponseTime('GET', '/medium', 200, 100)
      service.recordResponseTime('GET', '/slow', 200, 500)

      const slowest = service.getSlowestRoutes(10)
      expect(slowest[0].route).toBe('GET /slow')
      expect(slowest[0].avgDuration).toBe(500)
    })

    it('respects the limit parameter', () => {
      for (let i = 0; i < 20; i++) {
        service.recordResponseTime('GET', `/route-${i}`, 200, i * 10)
      }

      const slowest = service.getSlowestRoutes(5)
      expect(slowest).toHaveLength(5)
    })
  })

  describe('Response Time Percentiles', () => {
    it('calculates p50, p95, p99 correctly', () => {
      // Add 100 entries with durations 1-100
      for (let i = 1; i <= 100; i++) {
        service.recordResponseTime('GET', '/test', 200, i)
      }

      const metrics = service.getOverviewMetrics()
      // p50 should be around the middle
      expect(metrics.responseTime.p50).toBeGreaterThanOrEqual(45)
      expect(metrics.responseTime.p50).toBeLessThanOrEqual(55)
      // p95 should be high
      expect(metrics.responseTime.p95).toBeGreaterThanOrEqual(90)
      expect(metrics.responseTime.p95).toBeLessThanOrEqual(100)
      // p99 should be very high
      expect(metrics.responseTime.p99).toBeGreaterThanOrEqual(95)
      expect(metrics.responseTime.p99).toBeLessThanOrEqual(100)
      expect(metrics.responseTime.min).toBe(1)
      expect(metrics.responseTime.max).toBe(100)
    })
  })

  describe('Overview Metrics', () => {
    it('returns correct uptime', () => {
      const metrics = service.getOverviewMetrics()
      expect(metrics.uptime).toBeGreaterThanOrEqual(0)
    })

    it('returns zero error rate when no requests', () => {
      const metrics = service.getOverviewMetrics()
      expect(metrics.errorRate).toBe(0)
    })

    it('returns correct sample count', () => {
      service.recordResponseTime('GET', '/a', 200, 10)
      service.recordResponseTime('GET', '/b', 200, 20)

      const metrics = service.getOverviewMetrics()
      expect(metrics.responseTime.sampleCount).toBe(2)
    })
  })
})
