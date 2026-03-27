import { Request, Response, NextFunction } from 'express'
import { monitoringService } from '../services/monitoringService'
import { logger } from '../logger'

export class MonitoringController {
  /** GET /monitoring/health — lightweight liveness/readiness probe */
  async health(_req: Request, res: Response, _next: NextFunction) {
    try {
      const health = await monitoringService.getHealthStatus()
      const httpStatus = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503
      res.status(httpStatus).json(health)
    } catch (error) {
      logger.error('MonitoringController.health failed', { message: error?.message, stack: error?.stack })
      res.status(503).json({ status: 'unhealthy', error: 'Health check failed' })
    }
  }

  /** GET /monitoring/metrics — full metrics overview (response times, error rate, etc.) */
  async metrics(_req: Request, res: Response, _next: NextFunction) {
    try {
      const overview = monitoringService.getOverviewMetrics()
      res.json(overview)
    } catch (error) {
      logger.error('MonitoringController.metrics failed', { message: error?.message, stack: error?.stack })
      res.status(500).json({ error: 'Failed to retrieve metrics' })
    }
  }

  /** GET /monitoring/routes — per-route response time breakdown */
  async routes(_req: Request, res: Response, _next: NextFunction) {
    try {
      const routeMetrics = monitoringService.getRouteMetrics()
      res.json(routeMetrics)
    } catch (error) {
      logger.error('MonitoringController.routes failed', { message: error?.message, stack: error?.stack })
      res.status(500).json({ error: 'Failed to retrieve route metrics' })
    }
  }

  /** GET /monitoring/slow-routes — top 10 slowest routes */
  async slowRoutes(_req: Request, res: Response, _next: NextFunction) {
    try {
      const limit = 10
      const slowest = monitoringService.getSlowestRoutes(limit)
      res.json(slowest)
    } catch (error) {
      logger.error('MonitoringController.slowRoutes failed', { message: error?.message, stack: error?.stack })
      res.status(500).json({ error: 'Failed to retrieve slow routes' })
    }
  }
}
