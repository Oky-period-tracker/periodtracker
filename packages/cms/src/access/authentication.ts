import { User } from '../entity/User'
import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcrypt'

export class Authentication {
  static async authenticate(username: string, password: string, done: any) {
    const userRepository = getRepository(User)
    const user = await userRepository.findOne({ where: { username } })
    if (!user) {
      return done(null, false, { message: 'No user registered' })
    }
    const passwordsMatch = await bcrypt.compare(password, user.password) // user.password is the hashed password
    if (!passwordsMatch) {
      return done(null, false, { message: 'No password match' })
    }
    return done(null, user)
  }

  static async serializeUser(user: any, done: any) {
    done(null, user.id)
  }

  static async deserializeUser(id: string, done: any) {
    const user = await getRepository(User).findOne(id)
    done(null, user)
  }

  static isLoggedIn(request: Request, response: Response, next: NextFunction) {
    if (request.isAuthenticated()) {
      return next()
    }
    response.redirect('/login')
  }
}
