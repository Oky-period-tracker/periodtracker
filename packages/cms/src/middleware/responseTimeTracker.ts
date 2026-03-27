import { Request, Response, NextFunction } from 'express'
import { monitoringService } from '../services/monitoringService'

/**
 * Middleware that records response time for every request into the monitoring service.
 * Place BEFORE routes so it captures all responses.
 */
export function responseTimeTracker(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint()

  res.on('finish', () => {
    const durationNs = Number(process.hrtime.bigint() - start)
    const durationMs = Math.round(durationNs / 1e6)

    // Normalise route: strip query string, collapse IDs/UUIDs into :id
    const baseUrl = req.originalUrl.split('?')[0]
    const normalised = baseUrl.replace(
      /\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
      '/:id',
    ).replace(/\/\d+/g, '/:id')

    monitoringService.recordResponseTime(req.method, normalised, res.statusCode, durationMs)
  })

  next()
}
