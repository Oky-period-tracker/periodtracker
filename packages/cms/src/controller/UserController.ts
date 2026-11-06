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

// What the user endpoints answer with, whatever the entity holds: never the
// password, hashed or not, nor a column added to User later
const toPublic = (user: Partial<User>) =>
  Object.fromEntries(publicFields.map((field) => [field, user[field]]))

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

// Postgres unique_violation, raised by the unique index on user.username when
// two requests race past the lookup below
const isUniqueViolation = (error: any) => error?.code === '23505'

const duplicateUsername = (response: Response, action: string, username: string) => {
  logger.warn(`User ${action} failed: duplicate username`, { username })
  response.status(409).send({ error: 'username is not unique' })
}

const keepLastSuperAdmin = (request: Request, response: Response, action: string) => {
  logger.warn(`User ${action} refused: last superAdmin`, {
    requestingUser: request.user.id,
    target: request.params.id,
  })
  response
    .status(409)
    .send({ error: 'the CMS needs at least one super admin, create another one first' })
}

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

  // Login looks accounts up by username alone, so two accounts sharing one
  // would let the wrong one sign in. exceptId is the account being renamed
  private async usernameTaken(username: string, exceptId?: number) {
    const matches = await this.userRepository.find({ where: { username } })
    return matches.some((user) => user.id !== exceptId)
  }

  // Only a superAdmin can create or promote another one, so a CMS left
  // without any could only be recovered by hand in the database
  private async isLastSuperAdmin(user: User) {
    if (user.type !== 'superAdmin') return false
    return (await this.userRepository.count({ where: { type: 'superAdmin' } })) <= 1
  }

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
    return toPublic(user)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const lang = requestedLang(request.user, request.body.lang)
      if (!canManage(request.user, request.body.type, lang)) {
        deny(request, response, 'creation')
        return
      }
      if (await this.usernameTaken(request.body.username)) {
        duplicateUsername(response, 'creation', request.body.username)
        return
      }
      const hash = await bcrypt.hash(request.body.password, saltRounds)
      const created = await this.userRepository.save({
        username: request.body.username,
        password: hash,
        lang,
        date_created: moment.utc().toISOString(),
        type: request.body.type,
      })
      logger.info('CMS user created', { username: request.body.username, type: request.body.type })
      return toPublic(created)
    } catch (error) {
      if (isUniqueViolation(error)) {
        duplicateUsername(response, 'creation', request.body.username)
        return
      }
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
      if (request.body.type !== 'superAdmin' && (await this.isLastSuperAdmin(userToUpdate))) {
        keepLastSuperAdmin(request, response, 'update')
        return
      }
      if (await this.usernameTaken(request.body.username, userToUpdate.id)) {
        duplicateUsername(response, 'update', request.body.username)
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
      // New password, username or role: log the user out everywhere
      userToUpdate.sessionVersion += 1
      await this.userRepository.save(userToUpdate)
      logger.info('CMS user updated', { id: request.params.id, username: request.body.username })
      return toPublic(userToUpdate)
    } catch (error) {
      if (isUniqueViolation(error)) {
        duplicateUsername(response, 'update', request.body.username)
        return
      }
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
      if (await this.isLastSuperAdmin(userToRemove)) {
        keepLastSuperAdmin(request, response, 'removal')
        return
      }
      // Read before removing, which clears the id on the entity
      const removed = toPublic(userToRemove)
      await this.userRepository.remove(userToRemove)
      logger.info('CMS user removed', { id: request.params.id })
      return removed
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
