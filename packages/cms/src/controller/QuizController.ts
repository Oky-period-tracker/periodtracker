import { getRepository } from 'typeorm'
import { NextFunction, Request, Response } from 'express'
import { Quiz } from '../entity/Quiz'
import { v4 as uuid } from 'uuid'
import { ProvinceFilterService } from '../helpers/ProvinceFilterService'
import { OkyUser } from '../entity/OkyUser'

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
    // Get user province from query parameter or from user ID lookup
    let userProvince: string | null = null
    
    if (request.query.userId) {
      const okyUserRepository = getRepository(OkyUser)
      const user = await okyUserRepository.findOne(request.query.userId as string)
      userProvince = user?.province || null
    }

    // Build query with province filter
    const queryBuilder = this.quizRepository
      .createQueryBuilder('quiz')
      .where('quiz.lang = :lang', { lang: request.params.lang })
      .andWhere('quiz.live = :live', { live: true })
      .orderBy('quiz.topic', 'ASC')

    // Apply province filter
    ProvinceFilterService.applyProvinceFilter(queryBuilder, userProvince, 'quiz')

    return queryBuilder.getMany()
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
    
    // Handle province restrictions
    quizToSave.provinceRestricted = request.body.provinceRestricted === 'true' || request.body.provinceRestricted === true
    if (quizToSave.provinceRestricted && request.body.allowedProvinces) {
      quizToSave.allowedProvinces = Array.isArray(request.body.allowedProvinces)
        ? request.body.allowedProvinces.join(',')
        : request.body.allowedProvinces
    } else {
      quizToSave.allowedProvinces = null
    }
    
    await this.quizRepository.save(quizToSave)
    return quizToSave
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      if (!request.params.id) {
        return response.status(400).json({
          error: true,
          message: 'Quiz ID is required'
        })
      }

    const quizToUpdate = await this.quizRepository.findOne(request.params.id)
      if (!quizToUpdate) {
        return response.status(404).json({
          error: true,
          message: 'Quiz not found'
        })
      }

      const booleanFromStringLive = request.body.live === 'true' || request.body.live === true
      const booleanFromStringAge = request.body.isAgeRestricted === 'true' || request.body.isAgeRestricted === true

      quizToUpdate.topic = request.body.topic || quizToUpdate.topic
      quizToUpdate.question = request.body.question || quizToUpdate.question
      quizToUpdate.option1 = request.body.option1 || quizToUpdate.option1
      quizToUpdate.option2 = request.body.option2 || quizToUpdate.option2
      quizToUpdate.option3 = request.body.option3 || quizToUpdate.option3
      quizToUpdate.right_answer = request.body.right_answer || quizToUpdate.right_answer
      quizToUpdate.wrong_answer_response = request.body.wrong_answer_response || quizToUpdate.wrong_answer_response
      quizToUpdate.right_answer_response = request.body.right_answer_response || quizToUpdate.right_answer_response
    quizToUpdate.live = booleanFromStringLive
    quizToUpdate.isAgeRestricted = booleanFromStringAge
    quizToUpdate.lang = request.user.lang
    
    // Handle province restrictions
    quizToUpdate.provinceRestricted = request.body.provinceRestricted === 'true' || request.body.provinceRestricted === true
    if (quizToUpdate.provinceRestricted && request.body.allowedProvinces) {
      quizToUpdate.allowedProvinces = Array.isArray(request.body.allowedProvinces)
        ? request.body.allowedProvinces.join(',')
        : request.body.allowedProvinces
    } else {
      quizToUpdate.allowedProvinces = null
    }
    
    await this.quizRepository.save(quizToUpdate)
    return quizToUpdate
    } catch (error) {
      console.error('[QuizController] Update failed:', error)
      return response.status(500).json({
        error: true,
        message: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const quizToRemove = await this.quizRepository.findOne(request.params.id)
    await this.quizRepository.remove(quizToRemove)
    return quizToRemove
  }
}
