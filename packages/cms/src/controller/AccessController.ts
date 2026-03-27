import { NextFunction, Request, Response } from 'express'
import passport from 'passport'
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
    request.logout((err) => {
      if (err) {
        logger.error('Logout error', { userId, message: err?.message, stack: err?.stack })
        return next(err)
      }
      response.redirect('/login')
    })
  }
}
