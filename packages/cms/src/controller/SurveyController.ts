import { getRepository, createQueryBuilder, getManager, Not } from 'typeorm'
import { subMonths, differenceInYears } from 'date-fns'
import { NextFunction, Request, Response } from 'express'
import { Survey } from '../entity/Survey'
import { Question } from '../entity/Question'
import { v4 as uuid } from 'uuid'
import { env } from '../env'
import { logger } from '../logger'

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

    // oky_user lives in the configured schema and is not a CMS entity, so we
    // can't join it via the query builder (a schema-qualified table name is
    // parsed as an alias path). Fetch the user's age separately and apply the
    // age restriction in JS instead.
    const userRows = await entityManager.query(
      `SELECT date_of_birth FROM ${env.db.schema}.oky_user WHERE id = $1`,
      [request.query.user_id],
    )
    const dateOfBirth = userRows[0]?.date_of_birth
    const isOver14 = dateOfBirth ? differenceInYears(new Date(), new Date(dateOfBirth)) > 14 : false

    const query = createQueryBuilder('survey')
      .from(Survey, 'survey')
      .where(
        `survey.lang=:lang and survey.live=:live AND survey.date_created BETWEEN :start_date AND :end_date AND survey.id NOT IN (:...ids)`,
        {
          lang: request.params.lang,
          live: true,
          start_date: subMonths(new Date(), 1),
          end_date: new Date(),
          ids,
        },
      )

    // Age-restricted surveys are only shown to users older than 14.
    if (!isOver14) {
      query.andWhere('survey.isAgeRestricted = false')
    }

    return await query
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
    try {
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
      if (!Array.isArray(request.body.questions)) {
        response.status(400).send({ error: 'Questions must be an array' })
        return
      }
      await getManager().transaction(async (manager) => {
        const survey = await manager.getRepository(Survey).save(surveyToSave)
        const questions = manager.getRepository(Question)
        for (const question of request.body.questions) {
          await questions.save({
            ...question,
            id: uuid(),
            surveyId: survey.id,
            is_multiple: question.is_multiple === 'true',
          })
        }
      })
      logger.info('Survey created', {
        id: surveyToSave.id,
        questionsCount: request.body.questions?.length,
      })
      return surveyToSave
    } catch (error) {
      logger.error('SurveyController.save failed', { message: error?.message, stack: error?.stack })
      throw error
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const questions = request.body.questions || []
      const deletedQuestions = request.body.deletedQuestion || []
      if (!Array.isArray(questions) || !Array.isArray(deletedQuestions)) {
        response.status(400).send({ error: 'Questions and deletedQuestion must be arrays' })
        return
      }
      const updated = await getManager().transaction(async (manager) => {
        const surveys = manager.getRepository(Survey)
        const questionRepository = manager.getRepository(Question)
        const survey = await surveys.findOne(request.params.id, {
          lock: { mode: 'pessimistic_write' },
        })
        if (!survey) return false
        for (const question of questions) {
          if (!question.id) {
            await questionRepository.save({
              ...question,
              id: uuid(),
              surveyId: survey.id,
              is_multiple: question.is_multiple === 'true',
            })
          } else {
            const existing = await questionRepository.findOne({
              id: question.id,
              surveyId: survey.id,
            })
            if (!existing) {
              throw Object.assign(new Error('Question not found in this survey'), {
                statusCode: 404,
              })
            }
            await questionRepository.save({
              ...existing,
              ...question,
              id: existing.id,
              surveyId: survey.id,
              is_multiple: question.is_multiple === 'true',
            })
          }
        }
        for (const id of deletedQuestions) {
          const question = await questionRepository.findOne({ id, surveyId: survey.id })
          if (!question) {
            throw Object.assign(new Error('Question not found in this survey'), { statusCode: 404 })
          }
          await questionRepository.remove(question)
        }
        survey.lang = request.user.lang
        if (request.body.live) survey.live = request.body.live === 'true'
        if (request.body.isAgeRestricted)
          survey.isAgeRestricted = request.body.isAgeRestricted === 'true'
        await surveys.save(survey)
        return true
      })
      if (!updated) {
        response.status(404).send({ error: 'Survey not found' })
        return
      }
      logger.info('Survey updated', { id: request.params.id })
      return true
    } catch (error) {
      logger.error('SurveyController.update failed', {
        id: request.params.id,
        message: error?.message,
        stack: error?.stack,
      })
      throw error
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const removed = await getManager().transaction(async (manager) => {
        const surveys = manager.getRepository(Survey)
        const questions = manager.getRepository(Question)
        const survey = await surveys.findOne(request.params.id, {
          lock: { mode: 'pessimistic_write' },
        })
        if (!survey) return undefined
        const children = await questions.find({ where: { surveyId: survey.id } })
        await questions.remove(children)
        await surveys.remove(survey)
        return { survey, questionsRemoved: children.length }
      })
      if (!removed) {
        response.status(404).send({ error: 'Survey not found' })
        return
      }
      logger.info('Survey removed', {
        id: request.params.id,
        questionsRemoved: removed.questionsRemoved,
      })
      return removed.survey
    } catch (error) {
      logger.error('SurveyController.remove failed', {
        id: request.params.id,
        message: error?.message,
        stack: error?.stack,
      })
      throw error
    }
  }
}
