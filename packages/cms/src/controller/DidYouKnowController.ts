import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { DidYouKnow } from '../entity/DidYouKnow'
import { v4 as uuid } from 'uuid'

export class DidYouKnowController {
  private didYouKnowRepository = getRepository(DidYouKnow)

  async all(request: Request, response: Response, next: NextFunction) {
    return this.didYouKnowRepository.find({ where: { lang: request.user.lang } })
  }
  async mobileDidYouKnowByLanguage(request: Request, response: Response, next: NextFunction) {
    return this.didYouKnowRepository.find({
      where: { lang: request.params.lang, live: true },
      order: { title: 'ASC' },
    })
  }
  async one(request: Request, response: Response, next: NextFunction) {
    return this.didYouKnowRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const didYouKnowToSave = request.body
    didYouKnowToSave.id = uuid()
    didYouKnowToSave.lang = request.user.lang
    await this.didYouKnowRepository.save(didYouKnowToSave)
    return didYouKnowToSave
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const booleanFromStringLive = request.body.live === 'true'
    const booleanFromStringAge = request.body.isAgeRestricted === 'true'

    const didYouKnowToUpdate = await this.didYouKnowRepository.findOne(request.params.id)
    didYouKnowToUpdate.title = request.body.title
    didYouKnowToUpdate.content = request.body.content
    didYouKnowToUpdate.lang = request.user.lang
    didYouKnowToUpdate.isAgeRestricted = booleanFromStringAge
    didYouKnowToUpdate.live = booleanFromStringLive
    await this.didYouKnowRepository.save(didYouKnowToUpdate)
    return didYouKnowToUpdate
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const didYouKnowToRemove = await this.didYouKnowRepository.findOne(request.params.id)
    await this.didYouKnowRepository.remove(didYouKnowToRemove)
    return didYouKnowToRemove
  }
}
