import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { TermsAndConditions } from '../entity/TermsAndConditions'

export class TermsAndConditionsController {
  private termsAndConditionsRepository = getRepository(TermsAndConditions)

  async mobileTermsAndConditionsByLanguage(
    request: Request,
    response: Response,
    next: NextFunction,
  ) {
    const allTermsAndConditionVersions = await this.termsAndConditionsRepository.find({
      where: { lang: request.params.lang },
    })
    const latest = allTermsAndConditionVersions[allTermsAndConditionVersions.length - 1]
    return latest.json_dump
  }

  async all(request: Request, response: Response, next: NextFunction) {
    return this.termsAndConditionsRepository.find({
      where: { lang: request.user.lang },
    })
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.termsAndConditionsRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const aboutToSave = request.body
    aboutToSave.lang = request.user.lang
    await this.termsAndConditionsRepository.save(aboutToSave)
    return aboutToSave
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const aboutToUpdate = await this.termsAndConditionsRepository.findOne(request.params.id)
    aboutToUpdate.json_dump = request.body.json_dump

    aboutToUpdate.lang = request.user.lang
    await this.termsAndConditionsRepository.save(aboutToUpdate)
    return aboutToUpdate
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const aboutToRemove = await this.termsAndConditionsRepository.findOne(request.params.id)
    await this.termsAndConditionsRepository.remove(aboutToRemove)
    return aboutToRemove
  }
}
