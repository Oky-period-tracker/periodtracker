import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { PrivacyPolicy } from '../entity/PrivacyPolicy'
import { logger } from '../logger'

export class PrivacyPolicyController {
  private privacyPolicyRepository = getRepository(PrivacyPolicy)

  async mobilePrivacyPolicyByLanguage(request: Request, response: Response, next: NextFunction) {
    const latest = await this.privacyPolicyRepository.findOne({
      where: { lang: request.params.lang },
      order: { id: 'DESC' },
    })
    return latest?.json_dump || []
  }

  async all(request: Request, response: Response, next: NextFunction) {
    return this.privacyPolicyRepository.find({
      where: { lang: request.user.lang },
    })
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.privacyPolicyRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const aboutToSave = request.body
      aboutToSave.lang = request.user.lang
      await this.privacyPolicyRepository.save(aboutToSave)
      logger.info('Privacy policy saved', { lang: request.user.lang })
      return aboutToSave
    } catch (error) {
      logger.error('PrivacyPolicyController.save failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const aboutToUpdate = await this.privacyPolicyRepository.findOne(request.params.id)
      if (!aboutToUpdate) {
        logger.warn('Privacy policy not found for update', { id: request.params.id })
        response.status(404).send({ error: 'Privacy policy not found' })
        return
      }
      aboutToUpdate.json_dump = request.body.json_dump
      aboutToUpdate.lang = request.user.lang
      await this.privacyPolicyRepository.save(aboutToUpdate)
      logger.info('Privacy policy updated', { id: request.params.id })
      return aboutToUpdate
    } catch (error) {
      logger.error('PrivacyPolicyController.update failed', { id: request.params.id, message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const aboutToRemove = await this.privacyPolicyRepository.findOne(request.params.id)
      if (!aboutToRemove) {
        logger.warn('Privacy policy not found for removal', { id: request.params.id })
        response.status(404).send({ error: 'Privacy policy not found' })
        return
      }
      await this.privacyPolicyRepository.remove(aboutToRemove)
      logger.info('Privacy policy removed', { id: request.params.id })
      return aboutToRemove
    } catch (error) {
      logger.error('PrivacyPolicyController.remove failed', { id: request.params.id, message: error?.message, stack: error?.stack })
      throw error
    }
  }
}
