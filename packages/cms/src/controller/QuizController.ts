import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { Quiz } from '../entity/Quiz'
import { v4 as uuid } from 'uuid'
import { logger } from '../logger'
import { withoutDisabledFeatures } from '../helpers/features'

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
    const quizzes = await this.quizRepository.find({
      where: {
        lang: request.params.lang,
        live: true,
      },
      order: {
        topic: 'ASC',
      },
    })
    return withoutDisabledFeatures(quizzes)
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const quiz = await this.quizRepository.findOne({
      id: request.params.id,
      lang: request.user.lang,
    })
    if (!quiz) response.status(404).send({ error: 'Quiz not found' })
    return quiz
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

      const quizToUpdate = await this.quizRepository.findOne({
        id: request.params.id,
        lang: request.user.lang,
      })
      if (!quizToUpdate) {
        logger.warn('Quiz not found for update', { id: request.params.id, lang: request.user.lang })
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
      await this.quizRepository.save(quizToUpdate)
      logger.info('Quiz updated', { id: request.params.id })
      return quizToUpdate
    } catch (error) {
      logger.error('QuizController.update failed', {
        id: request.params.id,
        message: error?.message,
        stack: error?.stack,
      })
      throw error
    }
  }

  async updateLive(request: Request, response: Response, next: NextFunction) {
    return this.updateSwitch(request, response, 'live')
  }

  async updateAgeRestricted(request: Request, response: Response, next: NextFunction) {
    return this.updateSwitch(request, response, 'isAgeRestricted')
  }

  // Saves one switch of the quiz list and leaves the rest of the quiz as stored
  private async updateSwitch(
    request: Request,
    response: Response,
    field: 'live' | 'isAgeRestricted',
  ) {
    try {
      const value = request.body[field]
      if (![true, false, 'true', 'false'].includes(value)) {
        response.status(400).send({ error: `${field} must be true or false` })
        return
      }
      // Scoped to the editor's language: the page only lists those quizzes, so a
      // quiz in another language is treated as not found
      const quizToUpdate = await this.quizRepository.findOne({
        id: request.params.id,
        lang: request.user.lang,
      })
      if (!quizToUpdate) {
        logger.warn('Quiz not found for switch update', {
          id: request.params.id,
          lang: request.user.lang,
          field,
        })
        response.status(404).send({ error: 'Quiz not found' })
        return
      }
      quizToUpdate[field] = String(value) === 'true'
      await this.quizRepository.save(quizToUpdate)
      logger.info('Quiz switch updated', { id: request.params.id, [field]: quizToUpdate[field] })
      return { id: quizToUpdate.id, [field]: quizToUpdate[field] }
    } catch (error) {
      logger.error('QuizController.updateSwitch failed', {
        id: request.params.id,
        field,
        message: error?.message,
        stack: error?.stack,
      })
      throw error
    }
  }

  // Live All: one statement for every quiz of the editor's language, so the list
  // never ends up half switched
  async updateLiveAll(request: Request, response: Response, next: NextFunction) {
    try {
      const { live } = request.body
      if (![true, false, 'true', 'false'].includes(live)) {
        response.status(400).send({ error: 'live must be true or false' })
        return
      }
      const isLive = String(live) === 'true'
      const result = await this.quizRepository.update({ lang: request.user.lang }, { live: isLive })
      logger.info('Quiz live status updated for every quiz', {
        lang: request.user.lang,
        live: isLive,
        updated: result.affected,
      })
      return { live: isLive, updated: result.affected }
    } catch (error) {
      logger.error('QuizController.updateLiveAll failed', {
        lang: request.user?.lang,
        message: error?.message,
        stack: error?.stack,
      })
      throw error
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const quizToRemove = await this.quizRepository.findOne({
        id: request.params.id,
        lang: request.user.lang,
      })
      if (!quizToRemove) {
        logger.warn('Quiz not found for removal', {
          id: request.params.id,
          lang: request.user.lang,
        })
        response.status(404).send({ error: 'Quiz not found' })
        return
      }
      await this.quizRepository.remove(quizToRemove)
      logger.info('Quiz removed', { id: request.params.id })
      return quizToRemove
    } catch (error) {
      logger.error('QuizController.remove failed', {
        id: request.params.id,
        message: error?.message,
        stack: error?.stack,
      })
      throw error
    }
  }
}
