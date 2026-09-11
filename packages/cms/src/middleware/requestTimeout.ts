import { Request, Response, NextFunction } from 'express'
import { logger } from '../logger'
import { DEFAULT_REQUEST_TIMEOUT } from '../helpers/timeout'

/**
 * Middleware that sets a timeout on request processing.
 * If the response hasn't been sent within the timeout, sends a 503.
 * Does NOT abort the underlying work — just prevents hanging connections.
 */
export const requestTimeout = (timeoutMs = DEFAULT_REQUEST_TIMEOUT) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const timer = setTimeout(() => {
      if (!res.headersSent) {
        logger.error('Request timeout', {
          method: req.method,
          url: req.originalUrl,
          timeoutMs,
        })
        res.status(503).json({ error: 'Request timed out' })
      }
    }, timeoutMs)

    // Clear timeout when response finishes normally
    res.on('finish', () => clearTimeout(timer))
    res.on('close', () => clearTimeout(timer))

    next()
  }
}
