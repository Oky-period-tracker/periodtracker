// import { allSurveysSelectors, allQuizzesSelectors } from './contentSelectors'
import { allQuizzesSelectors } from './contentSelectors'

import { Moment } from 'moment'
import { toShortISO } from '../../services/dateUtils'
import _ from 'lodash'
import { ReduxState } from '../reducers'

const s = (state: ReduxState) => state.answer

export const surveyHasAnswerSelector = (state: ReduxState, id: string) => {
  const userId = state.auth?.user?.id
  if (!userId) return false

  const answers = s(state)?.[userId]
  if (!answers) return false

  return id in (answers.surveys || {})
}

// export const surveysWithoutAnswersSelector = (state: ReduxState) => {
//   return allSurveysSelectors(state).filter(({ id }) => !surveyHasAnswerSelector(state, id))
// }

export const quizHasAnswerSelector = (state: ReduxState, id: string) => {
  const userId = state.auth?.user?.id
  if (!userId) return false

  const answers = s(state)?.[userId]
  if (!answers) return false

  return id in (answers.quizzes || {})
}

// Had a type error here had to add any to avoid
// TODO:
// eslint-disable-next-line
export const quizAnswerByDate: any = (state: ReduxState, date: Moment) => {
  const userId = state.auth?.user?.id
  if (!userId) return null

  const quizzes = s(state)?.[userId]?.quizzes
  if (!quizzes) return null

  return Object.values(quizzes).find((item: any) => item?.utcDateTime === date.toISOString())
}

export const quizzesWithoutAnswersSelector = (state: ReduxState) => {
  return allQuizzesSelectors(state)
    .filter((quiz: any) => quiz?.id)
    .filter((quiz: any) => !quizHasAnswerSelector(state, quiz.id))
}

export const cardAnswerSelector = (state: ReduxState, date: Moment) => {
  const userId = state.auth?.user?.id
  if (!userId) return {}

  const answers = s(state)?.[userId]
  if (!answers) return {}

  return answers.cards?.[toShortISO(date)] || {}
}

export const verifyPeriodDaySelectorWithDate = (state: ReduxState, date: Moment) => {
  const userId = state.auth?.user?.id
  if (!userId) return {}

  const answers = s(state)?.[userId]
  if (!answers?.verifiedDates) return {}

  return answers.verifiedDates[toShortISO(date)] || {}
}

export const allCardAnswersSelector = (state: ReduxState) => {
  const userId = state.auth?.user?.id
  if (!userId) return {}

  const answers = s(state)?.[userId]
  if (!answers) return {}

  return answers.verifiedDates || {}
}

export const notesAnswerSelector = (
  state: ReduxState,
  date?: Moment,
): { title: string; notes: string } => {
  const emptyNotes = {
    title: '',
    notes: '',
  }
  if (!date) return emptyNotes

  const userId = state.auth?.user?.id
  if (!userId) return emptyNotes

  const answers = s(state)?.[userId]
  if (!answers) return emptyNotes

  return answers.notes?.[toShortISO(date)] || emptyNotes
}

export const mostAnsweredSelector = (state: ReduxState, startDate: Moment, endDate: Moment) => {
  const userId = state.auth?.user?.id
  if (!userId) return {}

  const answers = s(state)?.[userId]
  if (!answers?.cards) return {}

  const dates = Object.keys(answers.cards)

  const filteredDates = dates.filter((item) => {
    return (
      parseInt(item, 10) > parseInt(startDate.format('YYYYMMDD'), 10) &&
      parseInt(item, 10) <= parseInt(endDate.format('YYYYMMDD'), 10)
    )
  })

  // This creates an array of all the selected moods (now that there are multiple)
  const moodsInDateRange = filteredDates.reduce((acc, filteredDate) => {
    const card = answers.cards?.[filteredDate]
    if (!card) return acc

    return acc.concat(card.mood)
  }, [])

  // This counts occurrences of each item
  const moodCountedObject = _.countBy(moodsInDateRange, (mood: any) => mood)

  const bodyInDateRange = filteredDates.reduce((acc, filteredDate) => {
    const card = answers.cards?.[filteredDate]
    if (!card) return acc

    return acc.concat(card.body)
  }, [])

  const bodyCountedObject = _.countBy(bodyInDateRange, (body: any) => body)

  const activityInDateRange = filteredDates.reduce((acc, filteredDate) => {
    const card = answers.cards?.[filteredDate]
    if (!card) return acc

    return acc.concat(card.activity)
  }, [])

  const activityCountedObject = _.countBy(activityInDateRange, (activity: any) => activity)

  const flowInDateRange = filteredDates.reduce((acc, filteredDate) => {
    const card = answers.cards?.[filteredDate]
    if (!card) return acc

    return acc.concat(card.flow)
  }, [])

  const flowCountedObject = _.countBy(flowInDateRange, (flow: any) => flow)

  delete moodCountedObject.undefined
  delete bodyCountedObject.undefined
  delete activityCountedObject.undefined
  delete flowCountedObject.undefined

  const highestMood = Object.keys(moodCountedObject).reduce(
    (a, b) => (moodCountedObject[a] > moodCountedObject[b] ? a : b),
    null as any,
  )
  const highestBody = Object.keys(bodyCountedObject).reduce(
    (a, b) => (bodyCountedObject[a] > bodyCountedObject[b] ? a : b),
    null as any,
  )
  const highestActivity = Object.keys(activityCountedObject).reduce(
    (a, b) => (activityCountedObject[a] > activityCountedObject[b] ? a : b),
    null as any,
  )
  const highestFlow = Object.keys(flowCountedObject).reduce(
    (a, b) => (flowCountedObject[a] > flowCountedObject[b] ? a : b),
    null as any,
  )

  return {
    mood: highestMood,
    body: highestBody,
    activity: highestActivity,
    flow: highestFlow,
  }
}
