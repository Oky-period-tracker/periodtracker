import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { User } from '../entity/User'
import bcrypt from 'bcrypt'
import { accessControlList } from '../access/access-control'
import { typeToAction } from '../access/role-definitions'
import moment from 'moment'
import { logger } from '../logger'
const saltRounds = 10
const publicFields: Array<keyof User> = ['id', 'username', 'type', 'lang']

// Same hierarchy as the user management page: an account can only be managed
// by someone allowed to create its role, and only superAdmins work across
// languages. Checked against the stored account and against the requested
// type/lang, so nobody can promote themselves or reach a higher account
const canManage = (actor: User, type: string, lang: string) =>
  accessControlList.can(actor.type, typeToAction(type)) &&
  (accessControlList.can(actor.type, 'toggleLanguages') || lang === actor.lang)

// Admins only manage their own language, whatever the form sends
const requestedLang = (actor: User, lang: string) =>
  accessControlList.can(actor.type, 'toggleLanguages') ? lang : actor.lang

const deny = (request: Request, response: Response, action: string) => {
  logger.warn(`User ${action} denied: insufficient permissions`, {
    requestingUser: request.user.id,
    target: request.params.id,
    requestedType: request.body?.type,
  })
  response.status(403).send({ error: 'No permission rights to do that' })
}

export class UserController {
  private userRepository = getRepository(User)

  async all(request: Request, response: Response, next: NextFunction) {
    try {
      const users = await this.userRepository.find({ select: publicFields })
      return users.filter((user) => canManage(request.user, user.type, user.lang))
    } catch (error) {
      logger.error('UserController.all failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const user = await this.userRepository.findOne(request.params.id, { select: publicFields })
    if (!user) {
      response.status(404).send({ error: 'User not found' })
      return
    }
    if (!canManage(request.user, user.type, user.lang)) {
      deny(request, response, 'read')
      return
    }
    return user
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const lang = requestedLang(request.user, request.body.lang)
      if (!canManage(request.user, request.body.type, lang)) {
        deny(request, response, 'creation')
        return
      }
      const user = await this.userRepository.findOne({
        where: { username: request.body.username },
      })
      if (user) {
        logger.warn('User creation failed: duplicate username', { username: request.body.username })
        response.status(409).send({ error: 'username is not unique' })
        return
      }
      const hash = await bcrypt.hash(request.body.password, saltRounds)
      await this.userRepository.save({
        username: request.body.username,
        password: hash,
        lang,
        date_created: moment.utc().toISOString(),
        type: request.body.type,
      })
      logger.info('CMS user created', { username: request.body.username, type: request.body.type })
      return request.body
    } catch (error) {
      logger.error('UserController.save failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const userToUpdate = await this.userRepository.findOne(request.params.id)
      if (!userToUpdate) {
        logger.warn('User not found for update', { id: request.params.id })
        response.status(404).send({ error: 'User not found' })
        return
      }
      const lang = requestedLang(request.user, request.body.lang)
      if (
        !canManage(request.user, userToUpdate.type, userToUpdate.lang) ||
        !canManage(request.user, request.body.type, lang)
      ) {
        deny(request, response, 'update')
        return
      }
      userToUpdate.username = request.body.username
      userToUpdate.lang = lang
      userToUpdate.type = request.body.type
      // The edit form has no password field and sends it empty, which used to
      // overwrite the stored hash and lock the account out
      if (request.body.password) {
        userToUpdate.password = await bcrypt.hash(request.body.password, saltRounds)
      }
      await this.userRepository.save(userToUpdate)
      logger.info('CMS user updated', { id: request.params.id, username: request.body.username })
      return userToUpdate
    } catch (error) {
      logger.error('UserController.update failed', {
        id: request.params.id,
        message: error?.message,
        stack: error?.stack,
      })
      throw error
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const userToRemove = await this.userRepository.findOne(request.params.id)
      if (!userToRemove) {
        logger.warn('User not found for removal', { id: request.params.id })
        response.status(404).send({ error: 'User not found' })
        return
      }
      if (!canManage(request.user, userToRemove.type, userToRemove.lang)) {
        deny(request, response, 'removal')
        return
      }
      await this.userRepository.remove(userToRemove)
      logger.info('CMS user removed', { id: request.params.id })
      return userToRemove
    } catch (error) {
      logger.error('UserController.remove failed', {
        id: request.params.id,
        message: error?.message,
        stack: error?.stack,
      })
      throw error
    }
  }

  async changeLocation(request: Request, response: Response, next: NextFunction) {
    if (request.user.type !== 'superAdmin') {
      logger.warn('Language change denied: not superAdmin', { userId: request.user.id })
      response.status(400).send({ error: 'No permission rights to do that' })
      return
    }
    try {
      const userToUpdate = await this.userRepository.findOne(request.user.id)
      if (!userToUpdate) {
        logger.warn('User not found for language change', { id: request.user.id })
        response.status(404).send({ error: 'User not found' })
        return
      }
      userToUpdate.lang = request.body.lang
      await this.userRepository.save(userToUpdate)
      logger.info('User language changed', { userId: request.user.id, lang: request.body.lang })
      return ''
    } catch (error) {
      logger.error('UserController.changeLocation failed', {
        message: error?.message,
        stack: error?.stack,
      })
      throw error
    }
  }
}
