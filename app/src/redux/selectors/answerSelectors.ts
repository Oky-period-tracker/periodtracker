import { createSelector } from 'reselect'
import { allQuizzesSelectors } from './contentSelectors'

import { Moment } from 'moment'
import { toShortISO } from '../../services/dateUtils'
import _ from 'lodash'
import { ReduxState } from '../reducers'

// Stable empty references to avoid creating new objects/arrays on every call
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EMPTY_OBJECT = {} as any
const EMPTY_NOTES = { title: '', notes: '' }

const s = (state: ReduxState) => state.answer

export const surveyHasAnswerSelector = (state: ReduxState, id: string) => {
  // @ts-expect-error TODO:
  if (!s(state)[state.auth.user.id]) return false
  // @ts-expect-error TODO:
  return id in s(state)[state.auth.user.id].surveys
}

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

export const quizzesWithoutAnswersSelector = createSelector(
  [
    allQuizzesSelectors,
    (state: ReduxState) => s(state),
    (state: ReduxState) => state.auth.user,
  ],
  (allQuizzes, answers, user) => {
    return allQuizzes.filter(({ id }) => {
      // @ts-expect-error TODO:
      if (!answers[user?.id]) return true
      // @ts-expect-error TODO:
      return !(id in answers[user?.id].quizzes)
    })
  },
)

export const cardAnswerSelector = (state: ReduxState, date: Moment) => {
  if (!state.auth.user) return EMPTY_OBJECT
  if (!s(state)[state.auth.user.id]) return EMPTY_OBJECT
  return s(state)[state.auth.user.id]?.cards[toShortISO(date)] || EMPTY_OBJECT
}

export const verifyPeriodDaySelectorWithDate = (state: ReduxState, date: Moment) => {
  if (!state.auth.user) return EMPTY_OBJECT
  if (!s(state)[state.auth.user.id]) return EMPTY_OBJECT
  if (s(state)[state.auth.user.id]?.verifiedDates) {
    return s(state)[state.auth.user.id]?.verifiedDates[toShortISO(date)]
  } else return EMPTY_OBJECT
}

export const allCardAnswersSelector = (state: ReduxState) => {
  if (!state.auth.user) return EMPTY_OBJECT
  if (!s(state)[state.auth.user.id]) return EMPTY_OBJECT
  return s(state)[state.auth.user.id]?.verifiedDates || EMPTY_OBJECT
}

export const notesAnswerSelector = (
  state: ReduxState,
  date?: Moment,
): { title: string; notes: string } => {
  if (!date) return EMPTY_NOTES
  if (!state?.auth?.user?.id) return EMPTY_NOTES
  if (!s(state)[state.auth.user.id]) return EMPTY_NOTES
  return s(state)[state.auth.user.id].notes[toShortISO(date)] || EMPTY_NOTES
}

export const mostAnsweredSelector = createSelector(
  [
    (state: ReduxState) => s(state),
    (state: ReduxState) => state.auth.user,
    (_state: ReduxState, startDate: Moment) => startDate,
    (_state: ReduxState, _startDate: Moment, endDate: Moment) => endDate,
  ],
  (answers, user, startDate, endDate) => {
    // @ts-expect-error TODO:
    if (!answers[user?.id]) return EMPTY_OBJECT
    // @ts-expect-error TODO:
    const dates = Object.keys(answers[user.id].cards)
    const filteredDates = dates.filter((item) => {
      return (
        parseInt(item, 10) > parseInt(startDate.format('YYYYMMDD'), 10) &&
        parseInt(item, 10) <= parseInt(endDate.format('YYYYMMDD'), 10)
      )
    })

    // This creates an array of all the selected moods (now that there are multiple)
    const moodsInDateRange = filteredDates.reduce((acc: unknown[], filteredDate) => {
      // @ts-expect-error TODO:
      return acc.concat(answers[user.id].cards[filteredDate].mood)
    }, [])

    // This counts occurrences of each item
    const moodCountedObject = _.countBy(moodsInDateRange, (mood) => mood)

    const bodyInDateRange = filteredDates.reduce((acc: unknown[], filteredDate) => {
      // @ts-expect-error TODO:
      return acc.concat(answers[user.id].cards[filteredDate].body)
    }, [])

    const bodyCountedObject = _.countBy(bodyInDateRange, (body) => body)

    const activityInDateRange = filteredDates.reduce((acc: unknown[], filteredDate) => {
      return acc.concat(
        // @ts-expect-error TODO:
        answers[user.id].cards[filteredDate].activity,
      )
    }, [])

    const activityCountedObject = _.countBy(activityInDateRange, (activity) => activity)

    const flowInDateRange = filteredDates.reduce((acc: unknown[], filteredDate) => {
      // @ts-expect-error TODO:
      return acc.concat(answers[user.id].cards[filteredDate].flow)
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
  },
)
