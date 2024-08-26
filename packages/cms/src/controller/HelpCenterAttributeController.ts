import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { HelpCenterAttribute } from '../entity/HelpCenterAttribute'

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
    const helpCenterAttributeToSave = request.body
    await this.helpCenterAttributeRepository.save(helpCenterAttributeToSave)
    return helpCenterAttributeToSave
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const helpCenterAttributeToUpdate = await this.helpCenterAttributeRepository.findOne(
      request.params.id,
    )
    helpCenterAttributeToUpdate.isActive = request.body.isActive
    await this.helpCenterAttributeRepository.save(helpCenterAttributeToUpdate)
    return helpCenterAttributeToUpdate
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const helpCenterAttributeToRemove = await this.helpCenterAttributeRepository.findOne(
      request.params.id,
    )
    await this.helpCenterAttributeRepository.remove(helpCenterAttributeToRemove)
    return helpCenterAttributeToRemove
  }
}
