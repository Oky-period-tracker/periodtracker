import { createAction } from '../helpers'
import { Moment } from 'moment'
import { CardName, DailyCard } from '../../types'
import { AnswerForUserState } from '../reducers/answerReducer'
import { User } from '../reducers/authReducer'

export function answerSurvey(payload: {
  id: string
  user_id: string
  isCompleted: boolean
  isSurveyAnswered: boolean
  questions: any
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

export function answerDailyCard<T extends CardName>({
  cardName,
  answer,
  userID,
  utcDateTime,
  mutuallyExclusive = false,
  periodDay = false,
}: {
  cardName: T
  answer: DailyCard[T]
  userID: string
  utcDateTime: Moment
  mutuallyExclusive: boolean
  periodDay: boolean
}) {
  return createAction('ANSWER_DAILY_CARD', {
    cardName,
    answer,
    userID,
    utcDateTime,
    mutuallyExclusive,
    periodDay,
  })
}

export function answerVerifyDates({
  userID,
  utcDateTime,
  periodDay = false,
}: {
  userID: string
  utcDateTime: Moment
  periodDay: boolean
}) {
  return createAction('ANSWER_VERIFY_DATES', {
    userID,
    utcDateTime,
    periodDay,
  })
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
