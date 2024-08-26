import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { HelpCenter } from '../entity/HelpCenter'
import { getFormContents } from '../helpers/HelpCenterService'
import { bulkUpdateRowReorder } from '../helpers/common'
import { helpCenterData } from '../optional'

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
    const toSave = getFormContents(request)
    await this.helpCenterRepository.save(toSave)
    return toSave
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const helpCenterToUpdate = await this.helpCenterRepository.findOne(request.params.id)
    const updatedPayload = getFormContents(request, helpCenterToUpdate)
    await this.helpCenterRepository.save(updatedPayload)
    return helpCenterToUpdate
  }

  async bulkUpdate(request: Request, response: Response, next: NextFunction) {
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
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const helpCenterToRemove = await this.helpCenterRepository.findOne(request.params.id)
    await this.helpCenterRepository.remove(helpCenterToRemove)
    return helpCenterToRemove
  }

  async helpCenterAttributes(request: Request, response: Response, next: NextFunction) {
    return helpCenterData.attributes
  }
}
