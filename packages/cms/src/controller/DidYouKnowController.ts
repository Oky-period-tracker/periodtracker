import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { DidYouKnow } from '../entity/DidYouKnow'
import { v4 as uuid } from 'uuid'
import { logger } from '../logger'

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
    try {
      const didYouKnowToSave = request.body
      didYouKnowToSave.id = uuid()
      didYouKnowToSave.lang = request.user.lang
      await this.didYouKnowRepository.save(didYouKnowToSave)
      logger.info('DidYouKnow created', { id: didYouKnowToSave.id, title: didYouKnowToSave.title })
      return didYouKnowToSave
    } catch (error) {
      logger.error('DidYouKnowController.save failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const booleanFromStringLive = request.body.live === 'true'
      const booleanFromStringAge = request.body.isAgeRestricted === 'true'

      const didYouKnowToUpdate = await this.didYouKnowRepository.findOne(request.params.id)
      if (!didYouKnowToUpdate) {
        logger.warn('DidYouKnow not found for update', { id: request.params.id })
        response.status(404).send({ error: 'DidYouKnow not found' })
        return
      }
      didYouKnowToUpdate.title = request.body.title
      didYouKnowToUpdate.content = request.body.content
      didYouKnowToUpdate.lang = request.user.lang
      didYouKnowToUpdate.isAgeRestricted = booleanFromStringAge
      didYouKnowToUpdate.live = booleanFromStringLive
      await this.didYouKnowRepository.save(didYouKnowToUpdate)
      logger.info('DidYouKnow updated', { id: request.params.id })
      return didYouKnowToUpdate
    } catch (error) {
      logger.error('DidYouKnowController.update failed', { id: request.params.id, message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const didYouKnowToRemove = await this.didYouKnowRepository.findOne(request.params.id)
      if (!didYouKnowToRemove) {
        logger.warn('DidYouKnow not found for removal', { id: request.params.id })
        response.status(404).send({ error: 'DidYouKnow not found' })
        return
      }
      await this.didYouKnowRepository.remove(didYouKnowToRemove)
      logger.info('DidYouKnow removed', { id: request.params.id })
      return didYouKnowToRemove
    } catch (error) {
      logger.error('DidYouKnowController.remove failed', { id: request.params.id, message: error?.message, stack: error?.stack })
      throw error
    }
  }
}
