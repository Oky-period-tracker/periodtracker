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
      logger.error('Authentication error', { username, message: error?.message, stack: error?.stack })
      return done(error)
    }
  }

  static async serializeUser(user: any, done: any) {
    done(null, user.id)
  }

  static async deserializeUser(id: string, done: any) {
    try {
      const user = await getRepository(User).findOne(id)
      if (!user) {
        logger.warn('Deserialize failed: user not found', { userId: id })
      }
      done(null, user)
    } catch (error) {
      logger.error('Deserialize error', { userId: id, message: error?.message, stack: error?.stack })
      done(error)
    }
  }

  static isLoggedIn(request: Request, response: Response, next: NextFunction) {
    if (request.isAuthenticated()) {
      return next()
    }
    logger.info('Unauthenticated access attempt', { url: request.originalUrl, ip: request.ip })
    response.redirect('/login')
  }
}
