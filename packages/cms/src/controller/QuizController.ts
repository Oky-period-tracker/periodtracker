import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { Quiz } from '../entity/Quiz'
import { v4 as uuid } from 'uuid'
import { logger } from '../logger'

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
    try {
      const quizToSave = request.body
      const booleanFromStringLive = request.body.live === 'true'
      const booleanFromStringAge = request.body.isAgeRestricted === 'true'
      quizToSave.lang = request.user.lang
      quizToSave.live = booleanFromStringLive
      quizToSave.isAgeRestricted = booleanFromStringAge
      quizToSave.id = uuid()
      await this.quizRepository.save(quizToSave)
      logger.info('Quiz created', { id: quizToSave.id, topic: quizToSave.topic })
      return quizToSave
    } catch (error) {
      logger.error('QuizController.save failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const booleanFromStringLive = request.body.live === 'true'
      const booleanFromStringAge = request.body.isAgeRestricted === 'true'

      const quizToUpdate = await this.quizRepository.findOne(request.params.id)
      if (!quizToUpdate) {
        logger.warn('Quiz not found for update', { id: request.params.id })
        response.status(404).send({ error: 'Quiz not found' })
        return
      }
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
      logger.info('Quiz updated', { id: request.params.id })
      return quizToUpdate
    } catch (error) {
      logger.error('QuizController.update failed', { id: request.params.id, message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const quizToRemove = await this.quizRepository.findOne(request.params.id)
      if (!quizToRemove) {
        logger.warn('Quiz not found for removal', { id: request.params.id })
        response.status(404).send({ error: 'Quiz not found' })
        return
      }
      await this.quizRepository.remove(quizToRemove)
      logger.info('Quiz removed', { id: request.params.id })
      return quizToRemove
    } catch (error) {
      logger.error('QuizController.remove failed', { id: request.params.id, message: error?.message, stack: error?.stack })
      throw error
    }
  }
}
