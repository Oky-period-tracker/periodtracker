import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { HelpCenter } from '../entity/HelpCenter'

export class HelpCenterController {
  private helpCenterRepository = getRepository(HelpCenter)

  async all(request: Request, response: Response, next: NextFunction) {
    return this.helpCenterRepository.find({
      where: { lang: request.user.lang },
    })
  }

  async mobileHelpCenterByLanguage(request: Request, response: Response, next: NextFunction) {
    return this.helpCenterRepository.find({
      where: {
        lang: request.params.lang,
      },
    })
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.helpCenterRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const helpCenterToSave = request.body
    helpCenterToSave.lang = request.user.lang
    await this.helpCenterRepository.save(helpCenterToSave)
    return helpCenterToSave
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const helpCenterToUpdate = await this.helpCenterRepository.findOne(request.params.id)
    helpCenterToUpdate.title = request.body.title
    helpCenterToUpdate.caption = request.body.caption
    helpCenterToUpdate.contactOne = request.body.contactOne
    helpCenterToUpdate.contactTwo = request.body.contactTwo
    helpCenterToUpdate.address = request.body.address
    helpCenterToUpdate.website = request.body.website
    helpCenterToUpdate.lang = request.user.lang
    await this.helpCenterRepository.save(helpCenterToUpdate)
    return helpCenterToUpdate
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const helpCenterToRemove = await this.helpCenterRepository.findOne(request.params.id)
    await this.helpCenterRepository.remove(helpCenterToRemove)
    return helpCenterToRemove
  }
}
