import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { AboutBanner } from '../entity/AboutBanner'
import { logger } from '../logger'

export class AboutBannerController {
  private aboutBannerRepository = getRepository(AboutBanner)

  async mobileAboutBannerByLanguage(request: Request, response: Response, next: NextFunction) {
    const aboutImage = await this.aboutBannerRepository.findOne({
      where: { lang: request.params.lang },
    })

    return aboutImage?.image ? aboutImage?.image : ''
  }

  async mobileAboutBannerByLanguageConditional(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const aboutImage = await this.aboutBannerRepository.findOne({
        where: { lang: request.params.lang },
      })

      if (!aboutImage) {
        return {
          shouldUpdate: true,
          timestamp: new Date().getTime(),
          aboutBanner: '',
        }
      }

      const query = parseInt(String(request?.query?.timestamp ?? ''), 10)
      const timeLastFetched = isNaN(query) ? 0 : query
      const aboutImageTimestamp = new Date(aboutImage.timestamp).getTime()

      const isAboutImageStale = aboutImageTimestamp > timeLastFetched

      if (isAboutImageStale) {
        return {
          shouldUpdate: true,
          aboutBannerTimestamp: aboutImageTimestamp,
          aboutBanner: aboutImage.image,
        }
      }

      return {
        shouldUpdate: false,
      }
    } catch (error) {
      logger.error('AboutBannerController.mobileAboutBannerByLanguageConditional failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async saveOrUpdate(request: Request, response: Response, next: NextFunction) {
    try {
      let aboutToUpdate = await this.aboutBannerRepository.findOne({
        where: { lang: request.user.lang },
      })
      if (aboutToUpdate) {
        aboutToUpdate.image = request.body.image
        aboutToUpdate.timestamp = new Date()
      } else {
        aboutToUpdate = request.body
        aboutToUpdate.lang = request.user.lang
        aboutToUpdate.timestamp = new Date()
      }
      await this.aboutBannerRepository.save(aboutToUpdate)
      logger.info('About banner saved/updated', { lang: request.user.lang })
      return aboutToUpdate
    } catch (error) {
      logger.error('AboutBannerController.saveOrUpdate failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const aboutToRemove = await this.aboutBannerRepository.findOne(request.params.id)
      if (!aboutToRemove) {
        logger.warn('About banner not found for removal', { id: request.params.id })
        response.status(404).send({ error: 'About banner not found' })
        return
      }
      await this.aboutBannerRepository.remove(aboutToRemove)
      logger.info('About banner removed', { id: request.params.id })
      return aboutToRemove
    } catch (error) {
      logger.error('AboutBannerController.remove failed', { id: request.params.id, message: error?.message, stack: error?.stack })
      throw error
    }
  }
}
