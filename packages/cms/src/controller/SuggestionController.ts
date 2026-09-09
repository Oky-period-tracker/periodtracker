import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { Suggestion } from '../entity/Suggestion'
import { v4 as uuid } from 'uuid'

export class SuggestionController {
  private suggestionRepository = getRepository(Suggestion)

  async all(request: Request, response: Response, next: NextFunction) {
    return this.suggestionRepository.find({
      where: { lang: request.user.lang },
      order: {
        id: 'ASC',
      },
    })
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const suggestionToSave = request.body
    suggestionToSave.id = uuid()
    await this.suggestionRepository.save(suggestionToSave)
    return suggestionToSave
  }

  async updateStatus(request: Request, response: Response, next: NextFunction) {
    const suggestionToUpdate = await this.suggestionRepository.findOne(request.body.id)
    suggestionToUpdate.status = request.body.status === '1' ? 'open' : 'close'
    await this.suggestionRepository.save(suggestionToUpdate)
    return suggestionToUpdate
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const surveyToRemove = await this.suggestionRepository.findOne(request.params.id)
    await this.suggestionRepository.remove(surveyToRemove)
    return surveyToRemove
  }
}
