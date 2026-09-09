import { getRepository, createQueryBuilder, getManager, Not } from 'typeorm'
import { subMonths } from 'date-fns'
import { NextFunction, Request, Response } from 'express'
import { Survey } from '../entity/Survey'
import { Question } from '../entity/Question'
import { v4 as uuid } from 'uuid'
import { env } from '../env'

// TODO_ALEX: survey
const reformatSurveyData = (res: any) => {
  return res.map((sur) => ({
    ...sur,
    questions: sur.questions
      .sort((a: any, b: any) => a.sort_number - b.sort_number)
      .map((que) => {
        let options = []
        Array(5)
          .fill(0)
          .map((_, i) => {
            if (que[`option${i + 1}`])
              options = [...options, { [`option${i + 1}`]: que[`option${i + 1}`] }]
            delete que[`option${i + 1}`]
          })
        return { ...que, next_question: que.next_question, options }
      }),
  }))
}
export class SurveyController {
  private surveyRepository = getRepository(Survey)
  private questionRepository = getRepository(Question)
  async all(request: Request, response: Response, next: NextFunction) {
    return await createQueryBuilder('survey')
      .from(Survey, 'survey')
      .where({ lang: request.params.lang })
      .leftJoinAndMapMany('survey.questions', Question, 'question', 'question.surveyId = survey.id')
      .select(['survey', 'question'])
      .getMany()
  }
  async newMobileSurveysByLanguage(request: Request, response: Response, next: NextFunction) {
    const entityManager = getManager()
    const completedSurveys = await entityManager.query(
      `SELECT id FROM ${env.db.schema}.answered_surveys where user_id = $1 GROUP BY answered_surveys.id`,
      [request.query.user_id],
    )
    const ids =
      completedSurveys.length > 0
        ? completedSurveys.map((surveyAnswer: any) => surveyAnswer.id)
        : [uuid()]
    return await createQueryBuilder('survey')
      .from(Survey, 'survey')
      .where(
        `survey.lang=:lang and survey.live=:live AND survey.date_created BETWEEN :start_date AND :end_date AND survey.id NOT IN (:...ids)
      AND (survey.isAgeRestricted=true AND DATE_PART('year', age(:end_date, oky_user.date_of_birth)) > 14 OR survey.isAgeRestricted=false)
      `,
        {
          lang: request.params.lang,
          live: true,
          start_date: subMonths(new Date(), 1),
          end_date: new Date(),
          ids,
        },
      )
      .leftJoin('oky_user', 'oky_user', 'oky_user.id = :id', { id: request.query.user_id })
      .leftJoinAndMapMany('survey.questions', Question, 'question', 'question.surveyId = survey.id')
      .select(['survey', 'question'])
      .getMany()
      .then((res) => reformatSurveyData(res))
  }
  async mobileSurveysByLanguage(request: Request, response: Response, next: NextFunction) {
    return this.surveyRepository.find({
      where: { lang: request.params.lang, live: true, question: Not('') },
      order: { question: 'ASC' },
    })
  }
  async one(request: Request, response: Response, next: NextFunction) {
    return this.surveyRepository.findOne(request.params.id)
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const surveyToSave = {
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      option5: '',
      response: '',
      is_multiple: true,
      isAgeRestricted: false,
      live: false,
      lang: null,
      id: null,
    }
    surveyToSave.live = request.body.live
    surveyToSave.lang = request.user.lang
    surveyToSave.id = uuid()
    const survay = await this.surveyRepository.save(surveyToSave)
    request.body.questions.forEach(async (question: any) => {
      await this.questionRepository.save({
        ...question,
        id: uuid(),
        surveyId: survay.id,
        is_multiple: question.is_multiple === 'true',
      })
    })
    // console.log('after-create', survay, request.body)
    return surveyToSave
  }

  async update(request: Request, response: Response, next: NextFunction) {
    if (request.body.questions && request.body.questions.length) {
      request.body.questions.forEach(async (question: any) => {
        if (!question.id || question.id === '') {
          delete question.id
          await this.questionRepository.save({
            ...question,
            id: uuid(),
            surveyId: request.params.id,
            is_multiple: question.is_multiple === 'true',
          })
        } else {
          const questionToUpdate = await this.questionRepository.findOne(question.id)
          delete question.id
          await this.questionRepository.save({
            ...questionToUpdate,
            ...question,
            is_multiple: question.is_multiple === 'true',
          })
        }
      })
      if (request.body.deletedQuestion) {
        request.body.deletedQuestion.map(async (id) => {
          const question = await this.questionRepository.findOne(id)
          await this.questionRepository.remove(question)
        })
      }
    }
    const surveyToUpdate = await this.surveyRepository.findOne(request.params.id)
    surveyToUpdate.lang = request.user.lang
    if (request.body.live) surveyToUpdate.live = request.body.live === 'true'
    else surveyToUpdate.live = surveyToUpdate.live
    if (request.body.isAgeRestricted)
      surveyToUpdate.isAgeRestricted = request.body.isAgeRestricted === 'true'
    await this.surveyRepository.save(surveyToUpdate)
    return true
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const questions = await this.questionRepository.find({ where: { surveyId: request.params.id } })
    await this.questionRepository.remove(questions)
    const surveyToRemove = await this.surveyRepository.findOne(request.params.id)
    await this.surveyRepository.remove(surveyToRemove)
    return surveyToRemove
  }
}
