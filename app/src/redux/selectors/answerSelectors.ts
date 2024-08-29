// import { allSurveysSelectors, allQuizzesSelectors } from './contentSelectors'
import { allQuizzesSelectors } from './contentSelectors'

import { Moment } from 'moment'
import { toShortISO } from '../../services/dateUtils'
import _ from 'lodash'
import { ReduxState } from '../reducers'

const s = (state: ReduxState) => state.answer

export const surveyHasAnswerSelector = (state: ReduxState, id: string) => {
  // @ts-expect-error TODO:
  if (!s(state)[state.auth.user.id]) return false
  // @ts-expect-error TODO:
  return id in s(state)[state.auth.user.id].surveys
}

// export const surveysWithoutAnswersSelector = (state: ReduxState) => {
//   return allSurveysSelectors(state).filter(({ id }) => !surveyHasAnswerSelector(state, id))
// }

export const quizHasAnswerSelector = (state: ReduxState, id: string) => {
  // @ts-expect-error TODO:
  if (!s(state)[state.auth.user.id]) return false
  // @ts-expect-error TODO:
  return id in s(state)[state.auth.user.id].quizzes
}

// Had a type error here had to add any to avoid
// TODO:
// eslint-disable-next-line
export const quizAnswerByDate: any = (state: ReduxState, date: Moment) => {
  // @ts-expect-error TODO:
  if (!s(state)[state.auth.user.id]) return null
  // @ts-expect-error TODO:
  return Object.values(s(state)[state.auth.user.id].quizzes).filter(
    ({ utcDateTime }) => utcDateTime === date.toISOString(),
  )[0]
}

export const quizzesWithoutAnswersSelector = (state: ReduxState) => {
  return allQuizzesSelectors(state).filter(({ id }) => !quizHasAnswerSelector(state, id))
}

export const cardAnswerSelector = (state: ReduxState, date: Moment) => {
  if (!state.auth.user) return {} // for the use case on info screen where there is no authed user
  if (!s(state)[state.auth.user.id]) return {}
  return s(state)[state.auth.user.id]?.cards[toShortISO(date)] || {}
}
export const verifyPeriodDaySelectorWithDate = (state: ReduxState, date: Moment) => {
  if (!state.auth.user) return {} // for the use case on info screen where there is no authed user
  if (!s(state)[state.auth.user.id]) return {}
  if (s(state)[state.auth.user.id]?.verifiedDates) {
    return s(state)[state.auth.user.id]?.verifiedDates[toShortISO(date)]
  } else return {}
  // return s(state)[state.auth.user.id]?.verifiedDates[toShortISO(date)] || {}
}
export const allCardAnswersSelector = (state: ReduxState) => {
  if (!state.auth.user) return {} // for the use case on info screen where there is no authed user
  if (!s(state)[state.auth.user.id]) return {}
  return s(state)[state.auth.user.id]?.verifiedDates || {}
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
  if (!state?.auth?.user?.id) return emptyNotes
  if (!s(state)[state.auth.user.id]) return emptyNotes
  return s(state)[state.auth.user.id].notes[toShortISO(date)] || emptyNotes
}

export const mostAnsweredSelector = (state: ReduxState, startDate: Moment, endDate: Moment) => {
  // @ts-expect-error TODO:
  if (!s(state)[state.auth.user.id]) return {}
  // @ts-expect-error TODO:
  const dates = Object.keys(s(state)[state.auth.user.id].cards)
  const filteredDates = dates.filter((item) => {
    return (
      parseInt(item, 10) > parseInt(startDate.format('YYYYMMDD'), 10) &&
      parseInt(item, 10) <= parseInt(endDate.format('YYYYMMDD'), 10)
    )
  })

  // This creates an array of all the selected moods (now that there are multiple)
  const moodsInDateRange = filteredDates.reduce((acc, filteredDate) => {
    // @ts-expect-error TODO:
    return acc.concat(s(state)[state.auth.user.id].cards[filteredDate].mood)
  }, [])

  // This counts occurrences of each item
  const moodCountedObject = _.countBy(moodsInDateRange, (mood) => mood)

  const bodyInDateRange = filteredDates.reduce((acc, filteredDate) => {
    // @ts-expect-error TODO:
    return acc.concat(s(state)[state.auth.user.id].cards[filteredDate].body)
  }, [])

  const bodyCountedObject = _.countBy(bodyInDateRange, (body) => body)

  const activityInDateRange = filteredDates.reduce((acc, filteredDate) => {
    return acc.concat(
      // @ts-expect-error TODO:
      s(state)[state.auth.user.id].cards[filteredDate].activity,
    )
  }, [])

  const activityCountedObject = _.countBy(activityInDateRange, (activity) => activity)

  const flowInDateRange = filteredDates.reduce((acc, filteredDate) => {
    // @ts-expect-error TODO:
    return acc.concat(s(state)[state.auth.user.id].cards[filteredDate].flow)
  }, [])

  const flowCountedObject = _.countBy(flowInDateRange, (flow) => flow)

  delete moodCountedObject.undefined
  delete bodyCountedObject.undefined
  delete activityCountedObject.undefined
  delete flowCountedObject.undefined

  const highestMood = Object.keys(moodCountedObject).reduce(
    // @ts-expect-error TODO:
    (a, b) => (moodCountedObject[a] > moodCountedObject[b] ? a : b),
    null,
  )
  const highestBody = Object.keys(bodyCountedObject).reduce(
    // @ts-expect-error TODO:
    (a, b) => (bodyCountedObject[a] > bodyCountedObject[b] ? a : b),
    null,
  )
  const highestActivity = Object.keys(activityCountedObject).reduce(
    // @ts-expect-error TODO:
    (a, b) => (activityCountedObject[a] > activityCountedObject[b] ? a : b),
    null,
  )
  const highestFlow = Object.keys(flowCountedObject).reduce(
    // @ts-expect-error TODO:
    (a, b) => (flowCountedObject[a] > flowCountedObject[b] ? a : b),
    null,
  )

  return {
    mood: highestMood,
    body: highestBody,
    activity: highestActivity,
    flow: highestFlow,
  }
}
