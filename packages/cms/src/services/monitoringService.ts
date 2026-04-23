import os from 'os'
import { getConnection } from 'typeorm'
import { logger } from '../logger'

interface ResponseTimeEntry {
  method: string
  route: string
  statusCode: number
  duration: number
  timestamp: number
}

interface RouteMetrics {
  count: number
  totalDuration: number
  avgDuration: number
  minDuration: number
  maxDuration: number
  statusCodes: Record<number, number>
}

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy'
  uptime: number
  timestamp: string
  version: string
  checks: {
    database: { status: string; latency?: number; error?: string }
    memory: { status: string; usage: NodeJS.MemoryUsage; heapUsedPercent: number }
    cpu: { loadAvg: number[]; cpuCount: number }
  }
}

const MAX_ENTRIES = 10000
const ROUTE_METRICS_MAX_AGE_MS = 60 * 60 * 1000 // 1 hour

class MonitoringService {
  private responseTimeEntries: ResponseTimeEntry[] = []
  private startTime: number = Date.now()
  private requestCount = 0
  private errorCount = 0
  private statusCodeCounts: Record<number, number> = {}

  /** Record a completed request's response time and status */
  recordResponseTime(method: string, route: string, statusCode: number, duration: number) {
    this.requestCount++
    this.statusCodeCounts[statusCode] = (this.statusCodeCounts[statusCode] || 0) + 1

    if (statusCode >= 500) {
      this.errorCount++
    }

    this.responseTimeEntries.push({
      method,
      route,
      statusCode,
      duration,
      timestamp: Date.now(),
    })

    // Evict oldest entries to prevent memory growth
    if (this.responseTimeEntries.length > MAX_ENTRIES) {
      this.responseTimeEntries = this.responseTimeEntries.slice(-MAX_ENTRIES)
    }
  }

  /** Check database connectivity and latency */
  private async checkDatabase(): Promise<{ status: string; latency?: number; error?: string }> {
    const start = Date.now()
    try {
      const connection = getConnection()
      if (!connection.isConnected) {
        return { status: 'disconnected' }
      }
      await connection.query('SELECT 1')
      return { status: 'connected', latency: Date.now() - start }
    } catch (error) {
      return { status: 'error', error: error?.message }
    }
  }

  /** Full health check with all subsystem statuses */
  async getHealthStatus(): Promise<HealthStatus> {
    const memoryUsage = process.memoryUsage()
    const heapUsedPercent = Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)
    const dbCheck = await this.checkDatabase()

    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
    if (dbCheck.status !== 'connected') {
      status = 'unhealthy'
    } else if (heapUsedPercent > 90 || (dbCheck.latency && dbCheck.latency > 1000)) {
      status = 'degraded'
    }

    return {
      status,
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || 'unknown',
      checks: {
        database: dbCheck,
        memory: {
          status: heapUsedPercent > 90 ? 'warning' : 'ok',
          usage: memoryUsage,
          heapUsedPercent,
        },
        cpu: {
          loadAvg: os.loadavg(),
          cpuCount: os.cpus().length,
        },
      },
    }
  }

  /** Get aggregated metrics for all routes (last hour) */
  getRouteMetrics(): Record<string, RouteMetrics> {
    const cutoff = Date.now() - ROUTE_METRICS_MAX_AGE_MS
    const recentEntries = this.responseTimeEntries.filter((e) => e.timestamp >= cutoff)

    const routeMap: Record<string, RouteMetrics> = {}

    for (const entry of recentEntries) {
      const key = `${entry.method.toUpperCase()} ${entry.route}`
      if (!routeMap[key]) {
        routeMap[key] = {
          count: 0,
          totalDuration: 0,
          avgDuration: 0,
          minDuration: Infinity,
          maxDuration: 0,
          statusCodes: {},
        }
      }
      const m = routeMap[key]
      m.count++
      m.totalDuration += entry.duration
      m.avgDuration = Math.round(m.totalDuration / m.count)
      m.minDuration = Math.min(m.minDuration, entry.duration)
      m.maxDuration = Math.max(m.maxDuration, entry.duration)
      m.statusCodes[entry.statusCode] = (m.statusCodes[entry.statusCode] || 0) + 1
    }

    // Clean up Infinity for routes with no entries
    for (const key of Object.keys(routeMap)) {
      if (routeMap[key].minDuration === Infinity) {
        routeMap[key].minDuration = 0
      }
    }

    return routeMap
  }

  /** Get overall service summary metrics */
  getOverviewMetrics() {
    const cutoff = Date.now() - ROUTE_METRICS_MAX_AGE_MS
    const recentEntries = this.responseTimeEntries.filter((e) => e.timestamp >= cutoff)
    const durations = recentEntries.map((e) => e.duration)

    const sorted = [...durations].sort((a, b) => a - b)
    const p50 = sorted[Math.floor(sorted.length * 0.5)] || 0
    const p95 = sorted[Math.floor(sorted.length * 0.95)] || 0
    const p99 = sorted[Math.floor(sorted.length * 0.99)] || 0
    const avg = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0

    return {
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      totalRequests: this.requestCount,
      totalErrors: this.errorCount,
      errorRate: this.requestCount > 0 ? Math.round((this.errorCount / this.requestCount) * 10000) / 100 : 0,
      statusCodeCounts: { ...this.statusCodeCounts },
      responseTime: {
        window: '1h',
        sampleCount: durations.length,
        avg,
        p50,
        p95,
        p99,
        min: sorted[0] || 0,
        max: sorted[sorted.length - 1] || 0,
      },
    }
  }

  /** Get the top N slowest routes (from last hour) */
  getSlowestRoutes(limit = 10) {
    const metrics = this.getRouteMetrics()
    return Object.entries(metrics)
      .sort(([, a], [, b]) => b.avgDuration - a.avgDuration)
      .slice(0, limit)
      .map(([route, m]) => ({
        route,
        avgDuration: m.avgDuration,
        maxDuration: m.maxDuration,
        count: m.count,
      }))
  }
}

export const monitoringService = new MonitoringService()
