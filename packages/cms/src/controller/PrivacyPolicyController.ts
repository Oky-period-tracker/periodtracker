import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { PrivacyPolicy } from '../entity/PrivacyPolicy'

export class PrivacyPolicyController {
  private privacyPolicyRepository = getRepository(PrivacyPolicy)

  async mobilePrivacyPolicyByLanguage(request: Request, response: Response, next: NextFunction) {
    const allPoliciesVersions = await this.privacyPolicyRepository.find({
      where: { lang: request.params.lang },
    })
    const latest = allPoliciesVersions[allPoliciesVersions.length - 1]
    return latest.json_dump
  }

  async all(request: Request, response: Response, next: NextFunction) {
    return this.privacyPolicyRepository.find({
      where: { lang: request.user.lang },
    })
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.privacyPolicyRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const aboutToSave = request.body
    aboutToSave.lang = request.user.lang
    await this.privacyPolicyRepository.save(aboutToSave)
    return aboutToSave
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const aboutToUpdate = await this.privacyPolicyRepository.findOne(request.params.id)
    aboutToUpdate.json_dump = request.body.json_dump

    aboutToUpdate.lang = request.user.lang
    await this.privacyPolicyRepository.save(aboutToUpdate)
    return aboutToUpdate
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const aboutToRemove = await this.privacyPolicyRepository.findOne(request.params.id)
    console.log(aboutToRemove)
    await this.privacyPolicyRepository.remove(aboutToRemove)
    return aboutToRemove
  }
}
