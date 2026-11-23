import { NextFunction, Request, Response } from 'express'
import cookieSession from 'cookie-session'
import { logger } from '../logger'
import { safeRequestPath } from '../helpers/safeUtils'

// How long a CMS login lasts. sessionExpiry enforces it on the server, the
// cookie expiry only tells the browser to drop the cookie at the same time.
export const SESSION_MAX_AGE = 8 * 60 * 60 * 1000

/**
 * Signed session cookie that page scripts cannot read (httpOnly), that is
 * never sent on cross-site requests (CSRF) and, when `secure`, only travels
 * over HTTPS.
 */
export const sessionCookie = (secret: string, secure: boolean) => {
  const session = cookieSession({
    secret,
    httpOnly: true,
    sameSite: 'strict',
    secure,
    maxAge: SESSION_MAX_AGE,
  })
  return (req: Request, res: Response, next: NextFunction) => {
    // cookie-session silently drops a secure cookie on a plain HTTP request,
    // so login bounces back to /login. Leave a trace of the misconfiguration.
    if (secure && !req.secure) {
      logger.warn('Insecure request: the secure session cookie will not be set', {
        url: safeRequestPath(req.originalUrl),
        forwardedProto: req.get('X-Forwarded-Proto'),
      })
    }
    session(req, res, next)
  }
}

/**
 * The whole session lives in the signed cookie, so a copied cookie would be
 * accepted forever whatever expiry the browser was given. Log out sessions
 * whose login, stamped by Authentication.serializeUser, is older than
 * SESSION_MAX_AGE.
 */
export const sessionExpiry = (req: Request, _res: Response, next: NextFunction) => {
  const { passport, loginAt } = req.session
  if (passport?.user && !(loginAt && Date.now() - loginAt < SESSION_MAX_AGE)) {
    logger.info('Session expired', { userId: passport.user })
    delete req.session.passport
  }
  next()
}
