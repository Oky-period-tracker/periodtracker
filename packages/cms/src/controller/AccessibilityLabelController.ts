import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { AccessibilityLabels } from '../entity/AccessibilityLabels'
import { v4 as uuid } from 'uuid'

export class AccessibilityLabelController {
  private accessibilityLabelRepository = getRepository(AccessibilityLabels)

  async all(request: Request, response: Response, next: NextFunction) {
    return this.accessibilityLabelRepository.find({ where: { lang: request.user.lang } })
  }

  async mobileAccessibilityLabelsByLanguage(request: Request, response: Response, next: NextFunction) {
    return this.accessibilityLabelRepository.find({
      where: { lang: request.params.lang, live: true },
    })
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.accessibilityLabelRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const accessibilityLabelToSave = request.body
    accessibilityLabelToSave.id = uuid()
    accessibilityLabelToSave.lang = request.user.lang
    await this.accessibilityLabelRepository.save(accessibilityLabelToSave)
    return accessibilityLabelToSave
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const booleanFromStringLive = request.body.live === 'true'

    const accessibilityLabelToUpdate = await this.accessibilityLabelRepository.findOne(request.params.id)
    accessibilityLabelToUpdate.key = request.body.key
    accessibilityLabelToUpdate.label = request.body.label
    accessibilityLabelToUpdate.lang = request.user.lang
    accessibilityLabelToUpdate.live = booleanFromStringLive
    await this.accessibilityLabelRepository.save(accessibilityLabelToUpdate)
    return accessibilityLabelToUpdate
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const accessibilityLabelToRemove = await this.accessibilityLabelRepository.findOne(request.params.id)
    await this.accessibilityLabelRepository.remove(accessibilityLabelToRemove)
    return accessibilityLabelToRemove
  }
}

