import os from 'os'
import { getConnection } from 'typeorm'
import { logger } from '../logger'

// ─── Types ───────────────────────────────────────────────────────────

interface ExceptionRecord {
  timestamp: string
  method: string
  url: string
  controller?: string
  action?: string
  message: string
  stack?: string
  statusCode: number
  userId?: string
}

interface MemorySnapshot {
  timestamp: string
  rss: number
  heapTotal: number
  heapUsed: number
  external: number
  heapUsedPercent: number
  rssFormatted: string
  heapUsedFormatted: string
}

interface TimeoutRecord {
  timestamp: string
  method: string
  url: string
  duration: number
  threshold: number
}

interface EndpointFailureStats {
  route: string
  totalRequests: number
  failedRequests: number
  failureRate: number
  avgDuration: number
  maxDuration: number
  lastFailure?: string
  errors: Array<{ message: string; count: number }>
}

interface CrashReport {
  generatedAt: string
  uptime: number
  summary: {
    totalExceptions: number
    totalTimeouts: number
    memorySpikesDetected: number
    unhealthyEndpoints: number
  }
  exceptions: {
    recent: ExceptionRecord[]
    topErrors: Array<{ message: string; count: number; lastSeen: string }>
  }
  memory: {
    current: MemorySnapshot
    spikes: MemorySnapshot[]
    trend: 'stable' | 'growing' | 'declining'
  }
  timeouts: {
    recent: TimeoutRecord[]
    topRoutes: Array<{ route: string; count: number; avgDuration: number }>
  }
  failingEndpoints: EndpointFailureStats[]
  system: {
    loadAvg: number[]
    cpuCount: number
    freeMemory: number
    totalMemory: number
    platform: string
    nodeVersion: string
  }
}

// ─── Constants ───────────────────────────────────────────────────────

const MAX_EXCEPTIONS = 500
const MAX_MEMORY_SNAPSHOTS = 200
const MAX_TIMEOUTS = 500
const MEMORY_SAMPLE_INTERVAL_MS = 30_000 // 30 seconds
const HEAP_SPIKE_THRESHOLD_PERCENT = 85
const DEFAULT_TIMEOUT_THRESHOLD_MS = 10_000

// ─── Service ─────────────────────────────────────────────────────────

class CrashAnalysisService {
  private exceptions: ExceptionRecord[] = []
  private memorySnapshots: MemorySnapshot[] = []
  private timeouts: TimeoutRecord[] = []
  private requestStats: Map<string, { total: number; failed: number; durations: number[]; errors: Map<string, number>; lastFailure?: string }> = new Map()
  private startTime = Date.now()
  private memorySampler: ReturnType<typeof setInterval> | null = null
  private timeoutThresholdMs: number

  constructor(timeoutThresholdMs = DEFAULT_TIMEOUT_THRESHOLD_MS) {
    this.timeoutThresholdMs = timeoutThresholdMs
  }

  /** Start periodic memory sampling */
  startMemorySampling() {
    this.takeMemorySnapshot() // immediate first sample
    this.memorySampler = setInterval(() => this.takeMemorySnapshot(), MEMORY_SAMPLE_INTERVAL_MS)
    // Prevent the interval from keeping the process alive during shutdown
    if (this.memorySampler.unref) {
      this.memorySampler.unref()
    }
    logger.info('Crash analysis: memory sampling started', { intervalMs: MEMORY_SAMPLE_INTERVAL_MS })
  }

  /** Stop periodic memory sampling */
  stopMemorySampling() {
    if (this.memorySampler) {
      clearInterval(this.memorySampler)
      this.memorySampler = null
    }
  }

  // ─── Exception tracking ─────────────────────────────────────────

  /** Record an exception from a request handler */
  recordException(
    method: string,
    url: string,
    error: Error | { message?: string; stack?: string },
    statusCode: number,
    meta?: { controller?: string; action?: string; userId?: string },
  ) {
    const record: ExceptionRecord = {
      timestamp: new Date().toISOString(),
      method,
      url,
      controller: meta?.controller,
      action: meta?.action,
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      statusCode,
      userId: meta?.userId,
    }

    this.exceptions.push(record)
    if (this.exceptions.length > MAX_EXCEPTIONS) {
      this.exceptions = this.exceptions.slice(-MAX_EXCEPTIONS)
    }

    // Update per-route failure stats
    const routeKey = `${method.toUpperCase()} ${this.normaliseRoute(url)}`
    this.trackRouteFailure(routeKey, error?.message || 'Unknown error')
  }

  /** Get recent exceptions */
  getRecentExceptions(limit = 50): ExceptionRecord[] {
    return this.exceptions.slice(-limit).reverse()
  }

  /** Get top errors grouped by message */
  getTopErrors(limit = 10): Array<{ message: string; count: number; lastSeen: string }> {
    const errorMap = new Map<string, { count: number; lastSeen: string }>()

    for (const ex of this.exceptions) {
      const key = ex.message
      const existing = errorMap.get(key)
      if (existing) {
        existing.count++
        if (ex.timestamp > existing.lastSeen) {
          existing.lastSeen = ex.timestamp
        }
      } else {
        errorMap.set(key, { count: 1, lastSeen: ex.timestamp })
      }
    }

    return Array.from(errorMap.entries())
      .map(([message, stats]) => ({ message, ...stats }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  // ─── Memory tracking ────────────────────────────────────────────

  /** Take a memory usage snapshot */
  private takeMemorySnapshot() {
    const mem = process.memoryUsage()
    const heapUsedPercent = Math.round((mem.heapUsed / mem.heapTotal) * 100)

    const snapshot: MemorySnapshot = {
      timestamp: new Date().toISOString(),
      rss: mem.rss,
      heapTotal: mem.heapTotal,
      heapUsed: mem.heapUsed,
      external: mem.external,
      heapUsedPercent,
      rssFormatted: this.formatBytes(mem.rss),
      heapUsedFormatted: this.formatBytes(mem.heapUsed),
    }

    this.memorySnapshots.push(snapshot)
    if (this.memorySnapshots.length > MAX_MEMORY_SNAPSHOTS) {
      this.memorySnapshots = this.memorySnapshots.slice(-MAX_MEMORY_SNAPSHOTS)
    }

    // Log warning if spike detected
    if (heapUsedPercent >= HEAP_SPIKE_THRESHOLD_PERCENT) {
      logger.warn('Memory spike detected', {
        heapUsedPercent,
        heapUsed: snapshot.heapUsedFormatted,
        rss: snapshot.rssFormatted,
      })
    }
  }

  /** Get current memory state */
  getCurrentMemory(): MemorySnapshot {
    const mem = process.memoryUsage()
    const heapUsedPercent = Math.round((mem.heapUsed / mem.heapTotal) * 100)
    return {
      timestamp: new Date().toISOString(),
      rss: mem.rss,
      heapTotal: mem.heapTotal,
      heapUsed: mem.heapUsed,
      external: mem.external,
      heapUsedPercent,
      rssFormatted: this.formatBytes(mem.rss),
      heapUsedFormatted: this.formatBytes(mem.heapUsed),
    }
  }

  /** Get memory snapshots where heap usage exceeded threshold */
  getMemorySpikes(): MemorySnapshot[] {
    return this.memorySnapshots.filter((s) => s.heapUsedPercent >= HEAP_SPIKE_THRESHOLD_PERCENT)
  }

  /** Detect memory trend from recent snapshots */
  getMemoryTrend(): 'stable' | 'growing' | 'declining' {
    const snapshots = this.memorySnapshots
    if (snapshots.length < 4) return 'stable'

    const recent = snapshots.slice(-10)
    const firstHalf = recent.slice(0, Math.floor(recent.length / 2))
    const secondHalf = recent.slice(Math.floor(recent.length / 2))

    const avgFirst = firstHalf.reduce((sum, s) => sum + s.heapUsed, 0) / firstHalf.length
    const avgSecond = secondHalf.reduce((sum, s) => sum + s.heapUsed, 0) / secondHalf.length

    const changePercent = ((avgSecond - avgFirst) / avgFirst) * 100

    if (changePercent > 10) return 'growing'
    if (changePercent < -10) return 'declining'
    return 'stable'
  }

  // ─── Timeout tracking ───────────────────────────────────────────

  /** Record a request that exceeded the timeout threshold */
  recordTimeout(method: string, url: string, duration: number) {
    this.timeouts.push({
      timestamp: new Date().toISOString(),
      method,
      url: this.normaliseRoute(url),
      duration,
      threshold: this.timeoutThresholdMs,
    })

    if (this.timeouts.length > MAX_TIMEOUTS) {
      this.timeouts = this.timeouts.slice(-MAX_TIMEOUTS)
    }
  }

  /** Get timeout threshold */
  getTimeoutThreshold(): number {
    return this.timeoutThresholdMs
  }

  /** Get recent timeouts */
  getRecentTimeouts(limit = 50): TimeoutRecord[] {
    return this.timeouts.slice(-limit).reverse()
  }

  /** Get routes with most timeouts */
  getTimeoutHotspots(limit = 10): Array<{ route: string; count: number; avgDuration: number }> {
    const routeMap = new Map<string, { count: number; totalDuration: number }>()

    for (const t of this.timeouts) {
      const key = `${t.method.toUpperCase()} ${t.url}`
      const existing = routeMap.get(key)
      if (existing) {
        existing.count++
        existing.totalDuration += t.duration
      } else {
        routeMap.set(key, { count: 1, totalDuration: t.duration })
      }
    }

    return Array.from(routeMap.entries())
      .map(([route, stats]) => ({
        route,
        count: stats.count,
        avgDuration: Math.round(stats.totalDuration / stats.count),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
  }

  // ─── Endpoint failure tracking ──────────────────────────────────

  /** Record a request completion (success or failure) */
  recordRequest(method: string, url: string, statusCode: number, duration: number) {
    const routeKey = `${method.toUpperCase()} ${this.normaliseRoute(url)}`
    let stats = this.requestStats.get(routeKey)
    if (!stats) {
      stats = { total: 0, failed: 0, durations: [], errors: new Map() }
      this.requestStats.set(routeKey, stats)
    }

    stats.total++
    stats.durations.push(duration)
    // Keep only last 1000 durations per route
    if (stats.durations.length > 1000) {
      stats.durations = stats.durations.slice(-1000)
    }

    if (statusCode >= 500) {
      stats.failed++
      stats.lastFailure = new Date().toISOString()
    }
  }

  private trackRouteFailure(routeKey: string, errorMessage: string) {
    let stats = this.requestStats.get(routeKey)
    if (!stats) {
      stats = { total: 0, failed: 0, durations: [], errors: new Map() }
      this.requestStats.set(routeKey, stats)
    }

    const count = stats.errors.get(errorMessage) || 0
    stats.errors.set(errorMessage, count + 1)
  }

  /** Get endpoints with highest failure rates */
  getFailingEndpoints(minRequests = 5): EndpointFailureStats[] {
    const results: EndpointFailureStats[] = []

    for (const [route, stats] of this.requestStats) {
      if (stats.total < minRequests) continue
      if (stats.failed === 0) continue

      const avgDuration = stats.durations.length > 0
        ? Math.round(stats.durations.reduce((a, b) => a + b, 0) / stats.durations.length)
        : 0
      const maxDuration = stats.durations.length > 0 ? Math.max(...stats.durations) : 0

      const errors = Array.from(stats.errors.entries())
        .map(([message, count]) => ({ message, count }))
        .sort((a, b) => b.count - a.count)

      results.push({
        route,
        totalRequests: stats.total,
        failedRequests: stats.failed,
        failureRate: Math.round((stats.failed / stats.total) * 10000) / 100,
        avgDuration,
        maxDuration,
        lastFailure: stats.lastFailure,
        errors,
      })
    }

    return results.sort((a, b) => b.failureRate - a.failureRate)
  }

  /** Get endpoints sorted by load (request count) */
  getHighLoadEndpoints(limit = 10): Array<{ route: string; totalRequests: number; avgDuration: number; failureRate: number }> {
    const results: Array<{ route: string; totalRequests: number; avgDuration: number; failureRate: number }> = []

    for (const [route, stats] of this.requestStats) {
      const avgDuration = stats.durations.length > 0
        ? Math.round(stats.durations.reduce((a, b) => a + b, 0) / stats.durations.length)
        : 0

      results.push({
        route,
        totalRequests: stats.total,
        avgDuration,
        failureRate: stats.total > 0 ? Math.round((stats.failed / stats.total) * 10000) / 100 : 0,
      })
    }

    return results.sort((a, b) => b.totalRequests - a.totalRequests).slice(0, limit)
  }

  // ─── Full crash report ──────────────────────────────────────────

  /** Generate a comprehensive crash analysis report */
  async generateReport(): Promise<CrashReport> {
    const memorySpikes = this.getMemorySpikes()

    return {
      generatedAt: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      summary: {
        totalExceptions: this.exceptions.length,
        totalTimeouts: this.timeouts.length,
        memorySpikesDetected: memorySpikes.length,
        unhealthyEndpoints: this.getFailingEndpoints().length,
      },
      exceptions: {
        recent: this.getRecentExceptions(20),
        topErrors: this.getTopErrors(10),
      },
      memory: {
        current: this.getCurrentMemory(),
        spikes: memorySpikes.slice(-20),
        trend: this.getMemoryTrend(),
      },
      timeouts: {
        recent: this.getRecentTimeouts(20),
        topRoutes: this.getTimeoutHotspots(10),
      },
      failingEndpoints: this.getFailingEndpoints(),
      system: {
        loadAvg: os.loadavg(),
        cpuCount: os.cpus().length,
        freeMemory: os.freemem(),
        totalMemory: os.totalmem(),
        platform: os.platform(),
        nodeVersion: process.version,
      },
    }
  }

  // ─── Utilities ──────────────────────────────────────────────────

  /** Normalise URL by collapsing UUIDs and numeric IDs */
  private normaliseRoute(url: string): string {
    return url
      .split('?')[0]
      .replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/:id')
      .replace(/\/\d+/g, '/:id')
  }

  private formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
  }
}

export const crashAnalysisService = new CrashAnalysisService()
