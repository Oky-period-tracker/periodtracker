import { NextFunction, Request, Response } from 'express'
import multer from 'multer'
import { logger } from '../logger'
import { safeRequestPath } from '../helpers/safeUtils'
import { isApiRequest } from './errorLogger'

// Every CMS form and JSON call is text: articles, quizzes, notifications...
export const BODY_LIMIT = '1mb'
// Reorders post one field per changed row and property
export const BODY_PARAMETER_LIMIT = 10000
// The About banner is posted as a base64 data URL, room for a ~3.5 MB image
export const BANNER_BODY_LIMIT = '5mb'
// Public mobile API: the contact form, see SuggestionController
export const MOBILE_BODY_LIMIT = '32kb'

export const SPREADSHEET_MAX_BYTES = 10 * 1024 * 1024
export const VOICE_OVER_MAX_BYTES = 20 * 1024 * 1024

// The contact form is public: suggestions per client IP, see rateLimit
export const SUGGESTION_RATE_WINDOW = 15 * 60 * 1000
export const SUGGESTION_RATE_MAX = 10

/**
 * In-memory upload of a single file. The other fields of the upload forms
 * (locale, article id) are short.
 */
export const singleFileUpload = (maxBytes: number) =>
  multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxBytes, files: 1, fields: 10, fieldSize: 10 * 1024 },
  })

/**
 * Answers 413 when a body or upload goes over its limit. Without it a multer
 * limit ends as a 500 and both are recorded as crashes.
 */
export function payloadTooLarge(err: any, req: Request, res: Response, next: NextFunction) {
  const tooLarge =
    err?.type === 'entity.too.large' ||
    err?.type === 'parameters.too.many' ||
    (err instanceof multer.MulterError && err.code !== 'LIMIT_UNEXPECTED_FILE')
  if (!tooLarge || res.headersSent) {
    return next(err)
  }
  logger.warn('Request too large', {
    method: req.method,
    url: safeRequestPath(req.originalUrl),
    reason: err.type || err.code,
    ip: req.ip,
  })
  res.status(413)
  if (isApiRequest(req)) {
    res.json({ error: 'Payload too large' })
  } else {
    res.send('Payload too large')
  }
}

/**
 * Allows `max` requests per client IP in each `windowMs`, then answers 429.
 * Counts are kept in this process only, so each CMS task applies its own
 * limit. req.ip is the client's only when TRUST_PROXY matches the proxies.
 */
export const rateLimit = ({
  windowMs,
  max,
  maxClients = 10000,
}: {
  windowMs: number
  max: number
  maxClients?: number
}) => {
  // Insertion order is expiry order: a client is re-added when its window restarts
  const windows = new Map<string, { count: number; resetAt: number }>()

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now()
    for (const [ip, window] of windows) {
      if (window.resetAt > now) break
      windows.delete(ip)
    }

    let window = windows.get(req.ip)
    if (!window) {
      // Forget the oldest client rather than grow without bound
      if (windows.size >= maxClients) windows.delete(windows.keys().next().value)
      window = { count: 0, resetAt: now + windowMs }
      windows.set(req.ip, window)
    }
    window.count++

    if (window.count > max) {
      logger.warn('Rate limit exceeded', {
        method: req.method,
        url: safeRequestPath(req.originalUrl),
        ip: req.ip,
      })
      res.setHeader('Retry-After', String(Math.ceil((window.resetAt - now) / 1000)))
      res.status(429).json({ error: 'Too many requests' })
      return
    }
    next()
  }
}
