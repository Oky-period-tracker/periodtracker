import { Actions } from '../../types'
import { DailyCard } from '../../../types'

export interface VerifiedDates {
  [utcShortISO: string]: {
    periodDay: null | boolean
    utcDateTime: string
  }
}

export interface AnswerState {
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

const initialState: AnswerState = {
  quizzes: {},
  cards: {},
  verifiedDates: {},
  notes: {},
}

export function answerReducer(state: AnswerState = initialState, action: Actions): AnswerState {
  switch (action.type) {
    case 'REFRESH_STORE': {
      return {
        ...state,
      }
    }

    case 'ANSWER_QUIZ': {
      return {
        ...state,
      }
    }

    case 'ANSWER_DAILY_CARD': {
      return {
        ...state,
      }
    }

    case 'ANSWER_VERIFY_DATES': {
      return {
        ...state,
      }
    }

    case 'ANSWER_NOTES_CARD': {
      return {
        ...state,
      }
    }

    default:
      return state
  }
}
