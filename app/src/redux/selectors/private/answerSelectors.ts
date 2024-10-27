import { allQuizzesSelectors } from '../contentSelectors'

import { Moment } from 'moment'
import { toShortISO } from '../../../services/dateUtils'
import _ from 'lodash'
import { ReduxState } from '../../reducers'

const s = (state: ReduxState) => state.private.answer

export const quizHasAnswerSelector = (state: ReduxState, id: string) => {
  return id in s(state).quizzes
}

export const quizAnswerByDate = (state: ReduxState, date: Moment) => {
  return Object.values(s(state).quizzes).filter(
    ({ utcDateTime }) => utcDateTime === date.toISOString(),
  )[0]
}

export const quizzesWithoutAnswersSelector = (state: ReduxState) => {
  return allQuizzesSelectors(state).filter(({ id }) => !quizHasAnswerSelector(state, id))
}

export const cardAnswerSelector = (state: ReduxState, date: Moment) => {
  return s(state)?.cards[toShortISO(date)] || {}
}
export const verifyPeriodDaySelectorWithDate = (state: ReduxState, date: Moment) => {
  if (s(state)?.verifiedDates) {
    return s(state)?.verifiedDates[toShortISO(date)]
  } else return {}
}
export const allCardAnswersSelector = (state: ReduxState) => {
  return s(state)?.verifiedDates || {}
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
  if (!s(state)) return emptyNotes
  return s(state)?.notes?.[toShortISO(date)] || emptyNotes
}

export const mostAnsweredSelector = (state: ReduxState, startDate: Moment, endDate: Moment) => {
  const dates = Object.keys(s(state).cards)
  const filteredDates = dates.filter((item) => {
    return (
      parseInt(item, 10) > parseInt(startDate.format('YYYYMMDD'), 10) &&
      parseInt(item, 10) <= parseInt(endDate.format('YYYYMMDD'), 10)
    )
  })

  // This creates an array of all the selected moods (now that there are multiple)
  const moodsInDateRange = filteredDates.reduce((acc, filteredDate) => {
    // @ts-expect-error TODO:
    return acc.concat(s(state)?.cards?.[filteredDate]?.mood)
  }, [])

  // This counts occurrences of each item
  const moodCountedObject = _.countBy(moodsInDateRange, (mood) => mood)

  const bodyInDateRange = filteredDates.reduce((acc, filteredDate) => {
    // @ts-expect-error TODO:
    return acc.concat(s(state)?.cards?.[filteredDate]?.body)
  }, [])

  const bodyCountedObject = _.countBy(bodyInDateRange, (body) => body)

  const activityInDateRange = filteredDates.reduce((acc, filteredDate) => {
    return acc.concat(
      // @ts-expect-error TODO:
      s(state)?.cards?.[filteredDate]?.activity,
    )
  }, [])

  const activityCountedObject = _.countBy(activityInDateRange, (activity) => activity)

  const flowInDateRange = filteredDates.reduce((acc, filteredDate) => {
    // @ts-expect-error TODO:
    return acc.concat(s(state)?.cards?.[filteredDate]?.flow)
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

export const allSurveysSelector = (state: ReduxState) => {
  return s(state)?.allSurveys ?? []
}

export const completedSurveysSelector = (state: ReduxState) => {
  return s(state)?.completedSurveys ?? []
}
