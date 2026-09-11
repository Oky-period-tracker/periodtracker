import { Request, Response, NextFunction } from 'express'
import { crashAnalysisService } from '../services/crashAnalysisService'

/**
 * Middleware that feeds request data into the crash analysis service.
 * Tracks: response times, status codes, timeouts, and exceptions.
 * Place BEFORE routes so it captures all responses.
 */
export function crashDetector(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint()

  res.on('finish', () => {
    const durationNs = Number(process.hrtime.bigint() - start)
    const durationMs = Math.round(durationNs / 1e6)

    // Record every request for endpoint stats
    crashAnalysisService.recordRequest(req.method, req.originalUrl, res.statusCode, durationMs)

    // Detect timeout (request exceeded threshold but still completed)
    if (durationMs >= crashAnalysisService.getTimeoutThreshold()) {
      crashAnalysisService.recordTimeout(req.method, req.originalUrl, durationMs)
    }
  })

  next()
}

/**
 * Error-handling middleware that records exceptions into the crash analysis service.
 * Place AFTER routes, BEFORE the default error logger.
 */
export function crashExceptionCapture(err: Error, req: Request, res: Response, next: NextFunction) {
  crashAnalysisService.recordException(
    req.method,
    req.originalUrl,
    err,
    res.statusCode >= 400 ? res.statusCode : 500,
    {
      userId: (req.user as any)?.id,
    },
  )

  next(err)
}
