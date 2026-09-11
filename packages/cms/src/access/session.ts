import { NextFunction, Request, Response } from 'express'
import { env } from '../env'

/** Absolute session lifetime, after which the user has to log in again. */
export const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000 // 8 hours

// `cookie-session` reads these flags from the top level, not from a nested
// `cookie` object.
export const sessionOptions = {
  name: 'session',
  secret: env.app.secret,
  signed: true,
  overwrite: true,
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: env.isProduction, // needs `trust proxy` to be set behind the ingress
  maxAge: SESSION_MAX_AGE_MS,
}

/**
 * Expires sessions server-side.
 *
 * The session lives entirely in the signed cookie, so `maxAge` only asks the
 * browser to drop it. Stamping the expiry into the payload and checking it here
 * is what bounds the lifetime of a cookie that gets copied elsewhere.
 */
export function enforceSessionExpiry(request: Request, response: Response, next: NextFunction) {
  const session = request.session as any

  // Anonymous visitors get a session too (connect-flash writes one on the login
  // page); there is nothing to expire until someone logs in.
  if (!session || !session.passport || !session.passport.user) {
    return next()
  }

  if (typeof session.expiresAt !== 'number') {
    session.expiresAt = Date.now() + SESSION_MAX_AGE_MS
    return next()
  }

  if (Date.now() >= session.expiresAt) {
    request.session = null
  }

  return next()
}
