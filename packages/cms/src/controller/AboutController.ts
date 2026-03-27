import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { About } from '../entity/About'
import { logger } from '../logger'

export class AboutController {
  private aboutRepository = getRepository(About)

  async mobileAboutByLanguage(request: Request, response: Response, next: NextFunction) {
    const latest = await this.aboutRepository.findOne({
      where: { lang: request.params.lang },
      order: { id: 'DESC' },
    })
    return latest?.json_dump || []
  }

  async all(request: Request, response: Response, next: NextFunction) {
    return this.aboutRepository.find({
      where: { lang: request.user.lang },
    })
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.aboutRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    try {
      const aboutToSave = request.body
      aboutToSave.lang = request.user.lang
      await this.aboutRepository.save(aboutToSave)
      logger.info('About saved', { lang: request.user.lang })
      return aboutToSave
    } catch (error) {
      logger.error('AboutController.save failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const aboutToUpdate = await this.aboutRepository.findOne(request.params.id)
      if (!aboutToUpdate) {
        logger.warn('About not found for update', { id: request.params.id })
        response.status(404).send({ error: 'About not found' })
        return
      }
      aboutToUpdate.json_dump = request.body.json_dump
      aboutToUpdate.lang = request.user.lang
      await this.aboutRepository.save(aboutToUpdate)
      logger.info('About updated', { id: request.params.id })
      return aboutToUpdate
    } catch (error) {
      logger.error('AboutController.update failed', { id: request.params.id, message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const aboutToRemove = await this.aboutRepository.findOne(request.params.id)
      if (!aboutToRemove) {
        logger.warn('About not found for removal', { id: request.params.id })
        response.status(404).send({ error: 'About not found' })
        return
      }
      await this.aboutRepository.remove(aboutToRemove)
      logger.info('About removed', { id: request.params.id })
      return aboutToRemove
    } catch (error) {
      logger.error('AboutController.remove failed', { id: request.params.id, message: error?.message, stack: error?.stack })
      throw error
    }
  }
}
