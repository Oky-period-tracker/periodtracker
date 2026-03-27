import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { TermsAndConditions } from '../entity/TermsAndConditions'
import { logger } from '../logger'

export class TermsAndConditionsController {
  private termsAndConditionsRepository = getRepository(TermsAndConditions)

  async mobileTermsAndConditionsByLanguage(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const latest = await this.termsAndConditionsRepository.findOne({
      where: { lang: request.params.lang },
      order: { id: 'DESC' },
    })
    return latest?.json_dump || []
  }

  async all(request: Request, response: Response, next: NextFunction) {
    return this.termsAndConditionsRepository.find({
      where: { lang: request.user.lang },
    })
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.termsAndConditionsRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const aboutToSave = request.body
      aboutToSave.lang = request.user.lang
      await this.termsAndConditionsRepository.save(aboutToSave)
      logger.info('Terms and conditions saved', { lang: request.user.lang })
      return aboutToSave
    } catch (error) {
      logger.error('TermsAndConditionsController.save failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const aboutToUpdate = await this.termsAndConditionsRepository.findOne(request.params.id)
      if (!aboutToUpdate) {
        logger.warn('Terms and conditions not found for update', { id: request.params.id })
        response.status(404).send({ error: 'Terms and conditions not found' })
        return
      }
      aboutToUpdate.json_dump = request.body.json_dump
      aboutToUpdate.lang = request.user.lang
      await this.termsAndConditionsRepository.save(aboutToUpdate)
      logger.info('Terms and conditions updated', { id: request.params.id })
      return aboutToUpdate
    } catch (error) {
      logger.error('TermsAndConditionsController.update failed', { id: request.params.id, message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const aboutToRemove = await this.termsAndConditionsRepository.findOne(request.params.id)
      if (!aboutToRemove) {
        logger.warn('Terms and conditions not found for removal', { id: request.params.id })
        response.status(404).send({ error: 'Terms and conditions not found' })
        return
      }
      await this.termsAndConditionsRepository.remove(aboutToRemove)
      logger.info('Terms and conditions removed', { id: request.params.id })
      return aboutToRemove
    } catch (error) {
      logger.error('TermsAndConditionsController.remove failed', { id: request.params.id, message: error?.message, stack: error?.stack })
      throw error
    }
  }
}
