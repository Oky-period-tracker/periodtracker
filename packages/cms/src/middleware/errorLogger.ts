import { Request, Response, NextFunction } from 'express'
import { logger } from '../logger'

export function errorLogger(err: Error, req: Request, res: Response, next: NextFunction) {
  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userId: (req.user as any)?.id ?? null,
  })

  if (res.headersSent) {
    return next(err)
  }

  const isApiRequest = req.get('accept')?.includes('application/json') || req.originalUrl.startsWith('/mobile')
  const statusCode = (err as any).statusCode || 500

  if (isApiRequest) {
    res.status(statusCode).json({ error: 'Internal server error' })
  } else {
    res.status(statusCode).send('Internal server error')
  }
}
