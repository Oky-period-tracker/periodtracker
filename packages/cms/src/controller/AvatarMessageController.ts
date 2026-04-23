import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { AvatarMessages } from '../entity/AvatarMessages'
import { v4 as uuid } from 'uuid'
import { logger } from '../logger'

export class AvatarMessageController {
  private avatarMessageRepository = getRepository(AvatarMessages)

  async all(request: Request, response: Response, next: NextFunction) {
    return this.avatarMessageRepository.find({ where: { lang: request.user.lang } })
  }

  // @TODO: may need to physically order things here for the api
  async mobileAvatarMessagesByLanguage(request: Request, response: Response, next: NextFunction) {
    return this.avatarMessageRepository.find({
      where: { lang: request.params.lang, live: true },
    })
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.avatarMessageRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const avatarMessageToSave = request.body
      avatarMessageToSave.id = uuid()
      avatarMessageToSave.lang = request.user.lang
      await this.avatarMessageRepository.save(avatarMessageToSave)
      logger.info('Avatar message created', { id: avatarMessageToSave.id })
      return avatarMessageToSave
    } catch (error) {
      logger.error('AvatarMessageController.save failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const booleanFromStringLive = request.body.live === 'true'

      const avatarMessageToUpdate = await this.avatarMessageRepository.findOne(request.params.id)
      if (!avatarMessageToUpdate) {
        logger.warn('Avatar message not found for update', { id: request.params.id })
        response.status(404).send({ error: 'Avatar message not found' })
        return
      }
      avatarMessageToUpdate.content = request.body.content
      avatarMessageToUpdate.lang = request.user.lang
      avatarMessageToUpdate.live = booleanFromStringLive
      await this.avatarMessageRepository.save(avatarMessageToUpdate)
      logger.info('Avatar message updated', { id: request.params.id })
      return avatarMessageToUpdate
    } catch (error) {
      logger.error('AvatarMessageController.update failed', { id: request.params.id, message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const avatarMessageToRemove = await this.avatarMessageRepository.findOne(request.params.id)
      if (!avatarMessageToRemove) {
        logger.warn('Avatar message not found for removal', { id: request.params.id })
        response.status(404).send({ error: 'Avatar message not found' })
        return
      }
      await this.avatarMessageRepository.remove(avatarMessageToRemove)
      logger.info('Avatar message removed', { id: request.params.id })
      return avatarMessageToRemove
    } catch (error) {
      logger.error('AvatarMessageController.remove failed', { id: request.params.id, message: error?.message, stack: error?.stack })
      throw error
    }
  }
}
