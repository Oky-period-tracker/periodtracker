import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { AboutBanner } from '../entity/AboutBanner'

export class AboutBannerController {
  private aboutBannerRepository = getRepository(AboutBanner)

  async mobileAboutBannerByLanguage(request: Request, response: Response, next: NextFunction) {
    const aboutImage = await this.aboutBannerRepository.findOne({
      where: { lang: request.params.lang },
    })

    return aboutImage ? aboutImage.image : null
  }

  async saveOrUpdate(request: Request, response: Response, next: NextFunction) {
    let aboutToUpdate = await this.aboutBannerRepository.findOne({
      where: { lang: request.user.lang },
    })
    if (aboutToUpdate) {
      aboutToUpdate.image = request.body.image
    } else {
      aboutToUpdate = request.body
      aboutToUpdate.lang = request.user.lang
    }
    await this.aboutBannerRepository.save(aboutToUpdate)
    return aboutToUpdate
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const aboutToRemove = await this.aboutBannerRepository.findOne(request.params.id)
    console.log(aboutToRemove)
    await this.aboutBannerRepository.remove(aboutToRemove)
    return aboutToRemove
  }
}
