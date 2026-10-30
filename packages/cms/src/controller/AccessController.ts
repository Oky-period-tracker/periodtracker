import { NextFunction, Request, Response } from 'express'
import passport from 'passport'
import { Authentication } from '../access/authentication'
import { logger } from '../logger'

export class AccessController {
  async login(request: Request, response: Response, next: NextFunction) {
    logger.info('Login attempt', { username: request.body?.username, ip: request.ip })
    return passport.authenticate('local', {
      failureRedirect: '/login',
      successRedirect: '/encyclopedia',
      failureFlash: 'Invalid username or password.',
    })(request, response, next)
  }

  async logout(request: Request, response: Response, next: NextFunction) {
    const userId = (request.user as any)?.id
    logger.info('User logout', { userId })
    // passport 0.5.x `req.logout()` is synchronous and takes no callback, so the
    // redirect must run right after it (see package.json: passport ^0.5.2). The
    // installed @types/passport ships 0.6 signatures that require a callback, so
    // we cast to the actual 0.5.x signature to avoid a false type error.
    ;((request.logout as unknown) as () => void)()
    // Clearing this browser's cookie is not enough: a copy of it would still
    // be signed and valid
    if (userId) {
      await Authentication.revokeSessions(userId)
    }
    response.redirect('/login')
  }
}
