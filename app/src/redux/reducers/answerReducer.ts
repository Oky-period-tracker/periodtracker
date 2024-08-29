// TODO:
// eslint-disable-next-line
// @ts-nocheck
import { Actions } from '../types'
import { DailyCard } from '../../types'
import { combineReducers } from 'redux'
import { toShortISO } from '../../services/dateUtils'

export interface VerifiedDates {
  [utcShortISO: string]: {
    periodDay: null | boolean
    utcDateTime: string
  }
}

export interface AnswerForUserState {
  surveys: never // @deprecated
  quizzes: {
    [id: string]: {
      id: string
      question: string
      emoji: string
      answer: string
      isCorrect: boolean
      response: string
      utcDateTime: string
    }
  }
  cards: {
    [utcShortISO: string]: DailyCard
  }
  verifiedDates: VerifiedDates
  notes: {
    [utcShortISO: string]: {
      title: string
      notes: string
      utcDateTime: string
    }
  }
}

export interface AnswerState {
  [userId: string]: AnswerForUserState
}

function quizzesReducer(state = {}, action: Actions): AnswerForUserState['quizzes'] {
  if (action.type === 'ANSWER_QUIZ') {
    return {
      ...state,
      [action.payload.id]: {
        id: action.payload.id,
        question: action.payload.question,
        answerID: action.payload.answerID,
        emoji: action.payload.emoji,
        answer: action.payload.answer,
        isCorrect: action.payload.isCorrect,
        response: action.payload.response,
        utcDateTime: action.payload.utcDateTime.toISOString(),
      },
    }
  }

  return state
}

function cardsReducer(state = {}, action: Actions): AnswerForUserState['cards'] {
  if (action.type === 'ANSWER_DAILY_CARD') {
    const keyCard = toShortISO(action.payload.utcDateTime)
    let answersToInsert = []
    // Added as a way of handling multiple selections and to account for the initial release of single selections (Painful, I know)

    if (
      state[keyCard] !== undefined &&
      state[keyCard][action.payload.cardName] &&
      !action.payload.mutuallyExclusive &&
      action.payload.cardName !== 'periodDay'
    ) {
      if (typeof state[keyCard][action.payload.cardName] === 'string') {
        // This is to account for old data that used to just be a string and now we need to have multiple
        // we put that string as part of an array before concatenating the new answers
        answersToInsert = [state[keyCard][action.payload.cardName]].concat(action.payload.answer)
      } else {
        if (state[keyCard][action.payload.cardName].includes(action.payload.answer)) {
          // Remove if already contained (toggle ability)
          answersToInsert = state[keyCard][action.payload.cardName].filter(
            (item) => item !== action.payload.answer,
          )
        } else {
          answersToInsert = state[keyCard][action.payload.cardName].concat(action.payload.answer)
        }
      }
    } else {
      answersToInsert = [action.payload.answer]
    }

    return {
      ...state,
      [keyCard]: {
        ...(state[keyCard] || {}),
        [action.payload.cardName]: answersToInsert,
      },
    }
  }
  return state
}
function periodVerifyReducer(state = {}, action: Actions): AnswerForUserState['verifiedDates'] {
  if (action.type === 'REFRESH_STORE') {
    if (!action?.payload?.verifiedDates) {
      return state
    }
    return {
      ...action.payload.verifiedDates,
    }
  }

  if (action.type === 'ANSWER_VERIFY_DATES') {
    const keyCard = toShortISO(action.payload.utcDateTime)

    // TODO:
    // eslint-disable-next-line
    const answersToInsert = []
    // Added as a way of handling multiple selections and to account for the initial release of single selections (Painful, I know)
    return {
      ...state,
      [keyCard]: {
        ...(state[keyCard] || {}),
        periodDay: action.payload.periodDay,
      },
    }
  }
  return state
}

function notesReducer(state = {}, action: Actions): AnswerForUserState['notes'] {
  if (action.type === 'ANSWER_NOTES_CARD') {
    const keyCard = toShortISO(action.payload.utcDateTime)
    return {
      ...state,
      [keyCard]: {
        title: action.payload.title,
        notes: action.payload.notes,
        utcDateTime: action.payload.utcDateTime,
      },
    }
  }
  return state
}

const answerForUserReducer = combineReducers<AnswerForUserState, Actions>({
  quizzes: quizzesReducer,
  cards: cardsReducer,
  notes: notesReducer,
  verifiedDates: periodVerifyReducer,
})

export function answerReducer(state: AnswerState = {}, action: Actions): AnswerState {
  if (action.type === 'ANSWER_QUIZ') {
    return {
      ...state,
      [action.payload.userID]: answerForUserReducer(state[action.payload.userID], action),
    }
  }
  if (action.type === 'ANSWER_DAILY_CARD') {
    return {
      ...state,
      [action.payload.userID]: answerForUserReducer(state[action.payload.userID], action),
    }
  }
  if (action.type === 'ANSWER_VERIFY_DATES') {
    return {
      ...state,
      [action.payload.userID]: answerForUserReducer(state[action.payload.userID], action),
    }
  }
  if (action.type === 'ANSWER_NOTES_CARD') {
    return {
      ...state,
      [action.payload.userID]: answerForUserReducer(state[action.payload.userID], action),
    }
  }
  if (action.type === 'REFRESH_STORE') {
    return {
      ...state,
      [action.payload.userID]: answerForUserReducer(state[action.payload.userID], action),
    }
  }

  return state
}
