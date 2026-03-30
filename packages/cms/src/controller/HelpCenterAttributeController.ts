import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { HelpCenterAttribute } from '../entity/HelpCenterAttribute'
import { logger } from '../logger'

export class HelpCenterAttributeController {
  private helpCenterAttributeRepository = getRepository(HelpCenterAttribute)

  async mobileHelpCenterAttributes(request: Request, response: Response, next: NextFunction) {
    return this.helpCenterAttributeRepository.find({ where: { lang: request.params.lang } })
  }

  async all(request: Request, response: Response, next: NextFunction) {
    return this.helpCenterAttributeRepository.find()
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.helpCenterAttributeRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const helpCenterAttributeToSave = request.body
      await this.helpCenterAttributeRepository.save(helpCenterAttributeToSave)
      logger.info('Help center attribute saved')
      return helpCenterAttributeToSave
    } catch (error) {
      logger.error('HelpCenterAttributeController.save failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const helpCenterAttributeToUpdate = await this.helpCenterAttributeRepository.findOne(
        request.params.id,
      )
      if (!helpCenterAttributeToUpdate) {
        logger.warn('Help center attribute not found for update', { id: request.params.id })
        response.status(404).send({ error: 'Help center attribute not found' })
        return
      }
      helpCenterAttributeToUpdate.isActive = request.body.isActive
      await this.helpCenterAttributeRepository.save(helpCenterAttributeToUpdate)
      logger.info('Help center attribute updated', { id: request.params.id })
      return helpCenterAttributeToUpdate
    } catch (error) {
      logger.error('HelpCenterAttributeController.update failed', { id: request.params.id, message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const helpCenterAttributeToRemove = await this.helpCenterAttributeRepository.findOne(
        request.params.id,
      )
      if (!helpCenterAttributeToRemove) {
        logger.warn('Help center attribute not found for removal', { id: request.params.id })
        response.status(404).send({ error: 'Help center attribute not found' })
        return
      }
      await this.helpCenterAttributeRepository.remove(helpCenterAttributeToRemove)
      logger.info('Help center attribute removed', { id: request.params.id })
      return helpCenterAttributeToRemove
    } catch (error) {
      logger.error('HelpCenterAttributeController.remove failed', { id: request.params.id, message: error?.message, stack: error?.stack })
      throw error
    }
  }
}
