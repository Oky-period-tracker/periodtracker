import { Request, Response } from 'express'
import { healthCheckService } from '../services/healthCheckService'
import { logger } from '../logger'

export class HealthController {
  /**
   * GET /health — Full health status with all checks
   * Returns 200 if healthy/degraded, 503 if unhealthy
   * Used by Docker HEALTHCHECK and monitoring systems
   */
  async health(_req: Request, res: Response) {
    try {
      const health = await healthCheckService.getHealth()
      const httpStatus = health.status === 'unhealthy' ? 503 : 200
      res.status(httpStatus).json(health)
    } catch (error) {
      logger.error('HealthController.health failed', { message: error?.message })
      res.status(503).json({ status: 'unhealthy', error: 'Health check failed' })
    }
  }

  /**
   * GET /health/live — Liveness probe
   * Returns 200 if process is alive, used by orchestrators to decide restart
   */
  live(_req: Request, res: Response) {
    res.status(200).json({ status: 'alive' })
  }

  /**
   * GET /health/ready — Readiness probe
   * Returns 200 if service can accept traffic (DB connected, service ready)
   */
  async ready(_req: Request, res: Response) {
    try {
      const ready = await healthCheckService.isReady()
      if (ready) {
        res.status(200).json({ status: 'ready' })
      } else {
        res.status(503).json({ status: 'not_ready' })
      }
    } catch (error) {
      logger.error('HealthController.ready failed', { message: error?.message })
      res.status(503).json({ status: 'not_ready', error: 'Readiness check failed' })
    }
  }
}
