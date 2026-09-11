import { getConnection } from 'typeorm'
import { logger } from '../logger'
import { withTimeout } from '../helpers/timeout'

interface ServiceCheck {
  status: 'up' | 'down'
  latency?: number
  error?: string
  lastChecked: string
}

interface HealthState {
  status: 'healthy' | 'degraded' | 'unhealthy'
  uptime: number
  timestamp: string
  checks: {
    database: ServiceCheck
    service: ServiceCheck
  }
}

class HealthCheckService {
  private startTime = Date.now()
  private lastDbCheck: ServiceCheck = { status: 'down', lastChecked: new Date().toISOString() }
  private serviceReady = false

  /** Mark the service as ready (call after Express starts listening) */
  markServiceReady() {
    this.serviceReady = true
    logger.info('Health check: service marked as ready')
  }

  /** Mark the service as not ready (call on graceful shutdown) */
  markServiceNotReady() {
    this.serviceReady = false
    logger.info('Health check: service marked as not ready')
  }

  /** Simple liveness check — is the process alive? */
  isAlive(): boolean {
    return true
  }

  /** Readiness check — is the service ready to accept traffic? */
  async isReady(): Promise<boolean> {
    if (!this.serviceReady) return false
    const dbCheck = await this.checkDatabase()
    return dbCheck.status === 'up'
  }

  /** Check database connectivity and measure latency */
  private async checkDatabase(): Promise<ServiceCheck> {
    const start = Date.now()
    try {
      const connection = getConnection()
      if (!connection.isConnected) {
        this.lastDbCheck = {
          status: 'down',
          error: 'Database connection lost',
          lastChecked: new Date().toISOString(),
        }
        return this.lastDbCheck
      }
      await withTimeout(connection.query('SELECT 1'), 5000, 'Health check query')
      this.lastDbCheck = {
        status: 'up',
        latency: Date.now() - start,
        lastChecked: new Date().toISOString(),
      }
      return this.lastDbCheck
    } catch (error) {
      this.lastDbCheck = {
        status: 'down',
        error: error?.message || 'Unknown database error',
        lastChecked: new Date().toISOString(),
      }
      return this.lastDbCheck
    }
  }

  /** Check service availability */
  private checkService(): ServiceCheck {
    return {
      status: this.serviceReady ? 'up' : 'down',
      lastChecked: new Date().toISOString(),
      ...(this.serviceReady ? {} : { error: 'Service not ready' }),
    }
  }

  /** Full health check with all subsystem statuses */
  async getHealth(): Promise<HealthState> {
    const dbCheck = await this.checkDatabase()
    const serviceCheck = this.checkService()

    let status: HealthState['status'] = 'healthy'

    if (dbCheck.status === 'down' || serviceCheck.status === 'down') {
      status = 'unhealthy'
    } else if (dbCheck.latency && dbCheck.latency > 1000) {
      status = 'degraded'
    }

    return {
      status,
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      timestamp: new Date().toISOString(),
      checks: {
        database: dbCheck,
        service: serviceCheck,
      },
    }
  }
}

export const healthCheckService = new HealthCheckService()
