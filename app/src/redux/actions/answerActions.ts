import { createAction } from '../helpers'
import { Moment } from 'moment'
import { CardName, DailyCard } from '../../types'
import { AnswerForUserState } from '../reducers/answerReducer'
import { User } from '../reducers/authReducer'
import { SurveyQuestionAnswer } from '../../core/types'

export function answerSurvey(payload: {
  id: string
  user_id: string
  isCompleted: boolean // TODO: redundant?
  isSurveyAnswered: boolean
  questions: SurveyQuestionAnswer[]
  utcDateTime: Moment
}) {
  return createAction('ANSWER_SURVEY', payload)
}

export function answerQuiz(payload: {
  id: string
  question: string
  answerID: number
  emoji: string
  answer: string
  isCorrect: boolean
  response: string
  userID: string
  utcDateTime: Moment
}) {
  return createAction('ANSWER_QUIZ', payload)
}

export function answerDailyCard<T extends CardName>(payload: {
  cardName: T
  answer: DailyCard[T]
  userID: string
  utcDateTime: Moment
  mutuallyExclusive: boolean
  periodDay: boolean
}) {
  return createAction('ANSWER_DAILY_CARD', payload)
}

export function answerVerifyDates(payload: {
  userID: string
  utcDateTime: Moment
  periodDay: boolean
}) {
  return createAction('ANSWER_VERIFY_DATES', payload)
}

export function answerNotesCard(payload: {
  title: string
  notes: string
  userID: string
  utcDateTime: Moment
}) {
  return createAction('ANSWER_NOTES_CARD', payload)
}

export function shareApp() {
  return createAction('SHARE_APP')
}

export function migrateAnswerData(payload: {
  userId: User['id']
  key: string
  data: AnswerForUserState
}) {
  return createAction('MIGRATE_ANSWER_DATA', payload)
}
