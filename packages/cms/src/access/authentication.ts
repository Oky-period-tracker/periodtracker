import { safeRequestPath } from '../helpers/safeUtils'
import { User } from '../entity/User'
import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { logger } from '../logger'

export class Authentication {
  static async authenticate(username: string, password: string, done: any) {
    try {
      const userRepository = getRepository(User)
      const user = await userRepository.findOne({ where: { username } })
      if (!user) {
        logger.warn('Login failed: user not found', { username })
        return done(null, false, { message: 'No user registered' })
      }
      const passwordsMatch = await bcrypt.compare(password, user.password)
      if (!passwordsMatch) {
        logger.warn('Login failed: incorrect password', { username })
        return done(null, false, { message: 'No password match' })
      }
      logger.info('Login successful', { username, userId: user.id })
      return done(null, user)
    } catch (error) {
      logger.error('Authentication error', {
        username,
        message: error?.message,
        stack: error?.stack,
      })
      return done(error)
    }
  }

  // Runs on every req.logIn, whatever the login path, so it starts the clock
  // sessionExpiry checks every request against and records which
  // sessionVersion deserializeUser expects
  static async serializeUser(request: Request, user: any, done: any) {
    request.session.loginAt = Date.now()
    request.session.sessionVersion = user.sessionVersion
    done(null, user.id)
  }

  // The signed cookie only proves the user once logged in. A copy of it must
  // stop working after logout or an account change, which bump the user's
  // sessionVersion (revokeSessions).
  static async deserializeUser(request: Request, id: number, done: any) {
    try {
      const user = await getRepository(User).findOne(id)
      if (!user) {
        logger.warn('Deserialize failed: user not found', { userId: id })
        return done(null, false)
      }
      if (user.sessionVersion !== request.session.sessionVersion) {
        logger.info('Session revoked', { userId: id })
        return done(null, false)
      }
      done(null, user)
    } catch (error) {
      logger.error('Deserialize error', {
        userId: id,
        message: error?.message,
        stack: error?.stack,
      })
      done(error)
    }
  }

  // Logs the user out everywhere: every session issued so far is rejected
  static async revokeSessions(userId: number) {
    await getRepository(User).increment({ id: userId }, 'sessionVersion', 1)
  }

  static isLoggedIn(request: Request, response: Response, next: NextFunction) {
    if (request.isAuthenticated()) {
      return next()
    }
    logger.info('Unauthenticated access attempt', {
      url: safeRequestPath(request.originalUrl),
      ip: request.ip,
    })
    // AJAX calls would follow the redirect and fail with a misleading 404, so
    // they get a 401 the page can turn into a "log back in" message
    if (request.xhr) {
      return response.status(401).json({ error: 'Authentication required' })
    }
    response.redirect('/login')
  }
}
