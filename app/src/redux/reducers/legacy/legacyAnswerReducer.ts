import { DailyCard } from '../../../types'

export interface LegacyVerifiedDates {
  [utcShortISO: string]: {
    periodDay: null | boolean
    utcDateTime: string
  }
}

export interface LegacyAnswerForUserState {
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
  verifiedDates: LegacyVerifiedDates
  notes: {
    [utcShortISO: string]: {
      title: string
      notes: string
      utcDateTime: string
    }
  }
}

export interface LegacyAnswerState {
  [userId: string]: LegacyAnswerForUserState
}

export function legacyAnswerReducer(state: LegacyAnswerState = {}): LegacyAnswerState {
  return state
}
