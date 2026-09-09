import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { AvatarMessages } from '../entity/AvatarMessages'
import { v4 as uuid } from 'uuid'

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
    const avatarMessageToSave = request.body
    avatarMessageToSave.id = uuid()
    avatarMessageToSave.lang = request.user.lang
    await this.avatarMessageRepository.save(avatarMessageToSave)
    return avatarMessageToSave
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const booleanFromStringLive = request.body.live === 'true'

    const avatarMessageToUpdate = await this.avatarMessageRepository.findOne(request.params.id)
    avatarMessageToUpdate.content = request.body.content
    avatarMessageToUpdate.lang = request.user.lang
    avatarMessageToUpdate.live = booleanFromStringLive
    await this.avatarMessageRepository.save(avatarMessageToUpdate)
    return avatarMessageToUpdate
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const avatarMessageToRemove = await this.avatarMessageRepository.findOne(request.params.id)
    await this.avatarMessageRepository.remove(avatarMessageToRemove)
    return avatarMessageToRemove
  }
}
