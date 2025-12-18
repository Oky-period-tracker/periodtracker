import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { Translations } from '../entity/Translations'
import { v4 as uuid } from 'uuid'

export class TranslationController {
  private translationRepository = getRepository(Translations)

  async all(request: Request, response: Response, next: NextFunction) {
    return this.translationRepository.find({ where: { lang: request.user.lang } })
  }

  async mobileTranslationsByLanguage(request: Request, response: Response, next: NextFunction) {
    return this.translationRepository.find({
      where: { lang: request.params.lang, live: true },
    })
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.translationRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const translationToSave = request.body
    translationToSave.id = uuid()
    translationToSave.lang = request.user.lang
    // Default to 'ui' if type is not provided
    translationToSave.type = request.body.type || 'ui'
    await this.translationRepository.save(translationToSave)
    return translationToSave
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const booleanFromStringLive = request.body.live === 'true'

    const translationToUpdate = await this.translationRepository.findOne(request.params.id)
    translationToUpdate.key = request.body.key
    translationToUpdate.label = request.body.label
    translationToUpdate.type = request.body.type || 'ui' // Default to 'ui' if not provided
    translationToUpdate.lang = request.user.lang
    translationToUpdate.live = booleanFromStringLive
    await this.translationRepository.save(translationToUpdate)
    return translationToUpdate
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const translationToRemove = await this.translationRepository.findOne(request.params.id)
    await this.translationRepository.remove(translationToRemove)
    return translationToRemove
  }
}

