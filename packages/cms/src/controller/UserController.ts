import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { User } from '../entity/User'
import bcrypt from 'bcrypt'
import { accessControlList } from '../access/access-control'
import { typeToAction } from '../access/role-definitions'
import moment from 'moment'
import { logger } from '../logger'
const saltRounds = 10

export class UserController {
  private userRepository = getRepository(User)

  async all(request: Request, response: Response, next: NextFunction) {
    try {
      return await this.userRepository.find({
        select: ['id', 'username', 'type', 'lang'],
      })
    } catch (error) {
      logger.error('UserController.all failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const creationAction = typeToAction(request.body.type)
      const user = await this.userRepository.findOne({
        where: { username: request.body.username },
      })
      if (user) {
        logger.warn('User creation failed: duplicate username', { username: request.body.username })
        response.status(409).send({ error: 'username is not unique' })
        return
      }
      if (!accessControlList.can(request.user.type, creationAction)) {
        logger.warn('User creation denied: insufficient permissions', { requestingUser: request.user.id, requestedType: request.body.type })
        response.status(400).send({ error: 'No permission rights to do that' })
        return
      }
      const hash = await bcrypt.hash(request.body.password, saltRounds)
      await this.userRepository.save({
        username: request.body.username,
        password: hash,
        lang: request.body.lang,
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
      await bcrypt.hash(request.body.password, saltRounds).then(async hash => {
        userToUpdate.username = request.body.username
        userToUpdate.password = hash
        userToUpdate.lang = request.body.lang
        userToUpdate.type = request.body.type
      })
      await this.userRepository.save(userToUpdate)
      logger.info('CMS user updated', { id: request.params.id, username: request.body.username })
      return userToUpdate
    } catch (error) {
      logger.error('UserController.update failed', { id: request.params.id, message: error?.message, stack: error?.stack })
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
      await this.userRepository.remove(userToRemove)
      logger.info('CMS user removed', { id: request.params.id })
      return userToRemove
    } catch (error) {
      logger.error('UserController.remove failed', { id: request.params.id, message: error?.message, stack: error?.stack })
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
      logger.error('UserController.changeLocation failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }
}
