import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { HelpCenter } from '../entity/HelpCenter'
import { getFormContents } from '../helpers/HelpCenterService'
import { bulkUpdateRowReorder } from '../helpers/common'
import { helpCenterData } from '../optional'
import { logger } from '../logger'

export class HelpCenterController {
  private helpCenterRepository = getRepository(HelpCenter)

  async all(request: Request, response: Response, next: NextFunction) {
    return this.helpCenterRepository.find({
      where: { lang: request.user.lang },
      order: {
        sortingKey: 'ASC',
      },
    })
  }

  async mobileHelpCenterByLanguage(request: Request, response: Response, next: NextFunction) {
    const helpCenters: HelpCenter[] | any = await this.helpCenterRepository.find({
      where: {
        lang: request.params.lang,
        isActive: true,
      },
      order: {
        sortingKey: 'ASC',
      },
    })

    return helpCenters
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.helpCenterRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const toSave = getFormContents(request)
      await this.helpCenterRepository.save(toSave)
      logger.info('Help center created', { title: toSave.title })
      return toSave
    } catch (error) {
      logger.error('HelpCenterController.save failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const helpCenterToUpdate = await this.helpCenterRepository.findOne(request.params.id)
      if (!helpCenterToUpdate) {
        logger.warn('Help center not found for update', { id: request.params.id })
        response.status(404).send({ error: 'Help center not found' })
        return
      }
      const updatedPayload = getFormContents(request, helpCenterToUpdate)
      await this.helpCenterRepository.save(updatedPayload)
      logger.info('Help center updated', { id: request.params.id })
      return helpCenterToUpdate
    } catch (error) {
      logger.error('HelpCenterController.update failed', { id: request.params.id, message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async bulkUpdate(request: Request, response: Response, next: NextFunction) {
    try {
      if (request.body.rowReorderResult && request.body.rowReorderResult.length) {
        return await bulkUpdateRowReorder(this.helpCenterRepository, request.body.rowReorderResult)
      }

      return await this.helpCenterRepository.find({
        where: {
          lang: request.params.lang,
        },
        order: {
          sortingKey: 'ASC',
        },
      })
    } catch (error) {
      logger.error('HelpCenterController.bulkUpdate failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const helpCenterToRemove = await this.helpCenterRepository.findOne(request.params.id)
      if (!helpCenterToRemove) {
        logger.warn('Help center not found for removal', { id: request.params.id })
        response.status(404).send({ error: 'Help center not found' })
        return
      }
      await this.helpCenterRepository.remove(helpCenterToRemove)
      logger.info('Help center removed', { id: request.params.id })
      return helpCenterToRemove
    } catch (error) {
      logger.error('HelpCenterController.remove failed', { id: request.params.id, message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async helpCenterAttributes(request: Request, response: Response, next: NextFunction) {
    return helpCenterData.attributes
  }
}
