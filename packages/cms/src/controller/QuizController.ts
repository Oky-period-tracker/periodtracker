import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { Quiz } from '../entity/Quiz'
import { v4 as uuid } from 'uuid'

export class QuizController {
  private quizRepository = getRepository(Quiz)

  async all(request: Request, response: Response, next: NextFunction) {
    return this.quizRepository.find({
      where: { lang: request.user.lang, live: true },
      order: {
        topic: 'ASC',
      },
    })
  }

  async mobileQuizzesByLanguage(request: Request, response: Response, next: NextFunction) {
    return this.quizRepository.find({
      where: {
        lang: request.params.lang,
        live: true,
      },
      order: {
        topic: 'ASC',
      },
    })
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.quizRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const quizToSave = request.body
    const booleanFromStringLive = request.body.live === 'true'
    const booleanFromStringAge = request.body.isAgeRestricted === 'true'
    quizToSave.lang = request.user.lang
    quizToSave.live = booleanFromStringLive
    quizToSave.isAgeRestricted = booleanFromStringAge
    quizToSave.id = uuid()
    await this.quizRepository.save(quizToSave)
    return quizToSave
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const booleanFromStringLive = request.body.live === 'true'
    const booleanFromStringAge = request.body.isAgeRestricted === 'true'

    const quizToUpdate = await this.quizRepository.findOne(request.params.id)
    quizToUpdate.topic = request.body.topic
    quizToUpdate.question = request.body.question
    quizToUpdate.option1 = request.body.option1
    quizToUpdate.option2 = request.body.option2
    quizToUpdate.option3 = request.body.option3
    quizToUpdate.right_answer = request.body.right_answer
    quizToUpdate.wrong_answer_response = request.body.wrong_answer_response
    quizToUpdate.right_answer_response = request.body.right_answer_response
    quizToUpdate.live = booleanFromStringLive
    quizToUpdate.isAgeRestricted = booleanFromStringAge
    quizToUpdate.lang = request.user.lang
    await this.quizRepository.save(quizToUpdate)
    return quizToUpdate
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const quizToRemove = await this.quizRepository.findOne(request.params.id)
    await this.quizRepository.remove(quizToRemove)
    return quizToRemove
  }
}
