import { safeRequestPath } from '../helpers/safeUtils'
import { Request, Response, NextFunction } from 'express'
import { logger } from '../logger'
import { env } from '../env'

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now()

  // Log the incoming request
  logger.info('Incoming request', {
    method: req.method,
    url: safeRequestPath(req.originalUrl),
    ip: req.ip,
    userAgent: req.get('user-agent'),
  })

  // Capture the response on finish
  res.on('finish', () => {
    const duration = Date.now() - start
    const meta: Record<string, unknown> = {
      method: req.method,
      url: safeRequestPath(req.originalUrl),
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      // This middleware runs before passport.session(), so `req.user` is only
      // populated by the time the response finishes.
      userId: (req.user as any)?.id ?? null,
    }

    if (res.statusCode >= 400) {
      logger.warn('Request completed with error status', meta)
    } else {
      logger.info('Request completed', meta)
    }

    // Slow request warning
    if (duration > env.logging.slowRequestThreshold) {
      logger.warn('Slow request detected', {
        ...meta,
        threshold: `${env.logging.slowRequestThreshold}ms`,
      })
    }
  })

  next()
}
