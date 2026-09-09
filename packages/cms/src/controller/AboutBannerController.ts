import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { AboutBanner } from '../entity/AboutBanner'

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

    const query = parseInt(request?.query?.timestamp.toString(), 10)
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
  }

  async saveOrUpdate(request: Request, response: Response, next: NextFunction) {
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
    return aboutToUpdate
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const aboutToRemove = await this.aboutBannerRepository.findOne(request.params.id)
    await this.aboutBannerRepository.remove(aboutToRemove)
    return aboutToRemove
  }
}
