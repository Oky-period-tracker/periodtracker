import { ReduxState } from '../store'
// import { allSurveysSelectors, allQuizzesSelectors } from './contentSelectors'
import { allQuizzesSelectors } from './contentSelectors'

import { Moment } from 'moment'
import { toShortISO } from '../../services/dateUtils'
import _ from 'lodash'

const s = (state: ReduxState) => state.answer

export const surveyHasAnswerSelector = (state: ReduxState, id: string) => {
  if (!s(state)[state.auth.user.id]) return false
  return id in s(state)[state.auth.user.id].surveys
}

// export const surveysWithoutAnswersSelector = (state: ReduxState) => {
//   return allSurveysSelectors(state).filter(({ id }) => !surveyHasAnswerSelector(state, id))
// }

export const quizHasAnswerSelector = (state: ReduxState, id: string) => {
  if (!s(state)[state.auth.user.id]) return false
  return id in s(state)[state.auth.user.id].quizzes
}

// Had a type error here had to add any to avoid
export const quizAnswerByDate: any = (state: ReduxState, date: Moment) => {
  if (!s(state)[state.auth.user.id]) return null
  return Object.values(s(state)[state.auth.user.id].quizzes).filter(
    ({ utcDateTime }) => utcDateTime === date.toISOString(),
  )[0]
}

// Had a type error here had to add any to avoid
export const surveyAnswerByDate: any = (state: ReduxState, date: Moment) => {
  if (!s(state)[state.auth.user.id]) return null
  return Object.values(s(state)[state.auth.user.id].surveys).filter(
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
  if(s(state)[state.auth.user.id]?.verifiedDates){
    return s(state)[state.auth.user.id]?.verifiedDates[toShortISO(date)] 
  } else return {}
  // return s(state)[state.auth.user.id]?.verifiedDates[toShortISO(date)] || {}
}
export const allCardAnswersSelector = (state: ReduxState) => {  
  if (!state.auth.user) return {} // for the use case on info screen where there is no authed user
  if (!s(state)[state.auth.user.id]) return {}
  return s(state)[state.auth.user.id]?.verifiedDates || {}
}

export const notesAnswerSelector = (state: ReduxState, date: Moment) => {
  if (!s(state)[state.auth.user.id]) return {}
  return s(state)[state.auth.user.id].notes[toShortISO(date)] || {}
}

export const mostAnsweredSelector = (state: ReduxState, startDate: Moment, endDate: Moment) => {
  if (!s(state)[state.auth.user.id]) return {}
  const dates = Object.keys(s(state)[state.auth.user.id].cards)
  const filteredDates = dates.filter((item) => {
    return (
      parseInt(item, 10) > parseInt(startDate.format('YYYYMMDD'), 10) &&
      parseInt(item, 10) <= parseInt(endDate.format('YYYYMMDD'), 10)
    )
  })

  // This creates an array of all the selected moods (now that there are multiple)
  const moodsInDateRange = filteredDates.reduce((acc, filteredDate) => {
    return acc.concat(s(state)[state.auth.user.id].cards[filteredDate].mood)
  }, [])

  // This counts occurrences of each item
  const moodCountedObject = _.countBy(moodsInDateRange, (mood) => mood)

  const bodyInDateRange = filteredDates.reduce((acc, filteredDate) => {
    return acc.concat(s(state)[state.auth.user.id].cards[filteredDate].body)
  }, [])

  const bodyCountedObject = _.countBy(bodyInDateRange, (body) => body)

  const activityInDateRange = filteredDates.reduce((acc, filteredDate) => {
    return acc.concat(s(state)[state.auth.user.id].cards[filteredDate].activity)
  }, [])

  const activityCountedObject = _.countBy(activityInDateRange, (activity) => activity)

  const flowInDateRange = filteredDates.reduce((acc, filteredDate) => {
    return acc.concat(s(state)[state.auth.user.id].cards[filteredDate].flow)
  }, [])

  const flowCountedObject = _.countBy(flowInDateRange, (flow) => flow)

  delete moodCountedObject.undefined
  delete bodyCountedObject.undefined
  delete activityCountedObject.undefined
  delete flowCountedObject.undefined

  const highestMood = Object.keys(moodCountedObject).reduce(
    (a, b) => (moodCountedObject[a] > moodCountedObject[b] ? a : b),
    null,
  )
  const highestBody = Object.keys(bodyCountedObject).reduce(
    (a, b) => (bodyCountedObject[a] > bodyCountedObject[b] ? a : b),
    null,
  )
  const highestActivity = Object.keys(activityCountedObject).reduce(
    (a, b) => (activityCountedObject[a] > activityCountedObject[b] ? a : b),
    null,
  )
  const highestFlow = Object.keys(flowCountedObject).reduce(
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
