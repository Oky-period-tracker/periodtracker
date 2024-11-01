import { Actions } from '../../types'
import { DailyCard } from '../../../types'
import { AllSurveys, CompletedSurveys } from '../../../core/types'
import { toShortISO } from '../../../services/dateUtils'

export interface VerifiedDates {
  [utcShortISO: string]: {
    periodDay: null | boolean
    utcDateTime: string
  }
}

export interface AnswerState {
  allSurveys: AllSurveys
  completedSurveys: CompletedSurveys
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
  allSurveys: [],
  completedSurveys: [],
  quizzes: {},
  cards: {},
  verifiedDates: {},
  notes: {},
}

export function answerReducer(state: AnswerState = initialState, action: Actions): AnswerState {
  switch (action.type) {
    case 'LOGOUT_CLEANUP': {
      return initialState
    }

    case 'MIGRATE_STORE':
      return {
        ...state,
        ...action.payload.answer,
      }

    case 'SYNC_STORES': {
      if (action.payload.isNewer) {
        return {
          ...state,
          ...action.payload.onlinePrivateStore.answer,
        }
      }

      return {
        ...action.payload.onlinePrivateStore.answer,
        ...state,
      }
    }

    case 'ANSWER_QUIZ': {
      return {
        ...state,
        quizzes: {
          ...state.quizzes,
          [action.payload.id]: {
            id: action.payload.id,
            question: action.payload.question,
            // @ts-expect-error TODO:
            answerID: action.payload.answerID,
            emoji: action.payload.emoji,
            answer: action.payload.answer,
            isCorrect: action.payload.isCorrect,
            response: action.payload.response,
            utcDateTime: action.payload.utcDateTime.toISOString(),
          },
        },
      }
    }

    case 'ANSWER_DAILY_CARD': {
      const keyCard = toShortISO(action.payload.utcDateTime)
      let answersToInsert: string[] = []
      // Added as a way of handling multiple selections and to account for the initial release of single selections (Painful, I know)

      if (
        state.cards[keyCard] !== undefined &&
        state.cards[keyCard][action.payload.cardName] &&
        !action.payload.mutuallyExclusive &&
        action.payload.cardName !== 'periodDay'
      ) {
        if (!action.payload.answer || action.payload.answer === true) {
          return state
        }

        if (typeof state.cards[keyCard][action.payload.cardName] === 'string') {
          // This is to account for old data that used to just be a string and now we need to have multiple
          // we put that string as part of an array before concatenating the new answers
          const legacyData = state.cards[keyCard][action.payload.cardName]
          const baseArray = legacyData ? [legacyData] : []
          answersToInsert = baseArray.concat(action.payload.answer)
        } else {
          if (state.cards?.[keyCard]?.[action.payload.cardName]?.includes(action.payload.answer)) {
            // Remove if already contained (toggle ability)
            // @ts-expect-error TODO:
            answersToInsert = state.cards?.[keyCard]?.[action.payload.cardName]?.filter(
              // @ts-expect-error TODO:
              (item) => item !== action.payload.answer,
            )
          } else {
            // @ts-expect-error TODO:
            answersToInsert = state.cards?.[keyCard]?.[action.payload.cardName]?.concat(
              action.payload.answer,
            )
          }
        }
      } else {
        // @ts-expect-error TODO:
        answersToInsert = [action.payload.answer]
      }

      return {
        ...state,
        cards: {
          ...state.cards,
          [keyCard]: {
            ...(state.cards[keyCard] || {}),
            [action.payload.cardName]: answersToInsert,
          },
        },
      }
    }

    case 'ANSWER_VERIFY_DATES': {
      const keyCard = toShortISO(action.payload.utcDateTime)
      return {
        ...state,
        verifiedDates: {
          ...state.verifiedDates,
          [keyCard]: {
            ...(state.verifiedDates[keyCard] || {}),
            periodDay: action.payload.periodDay,
          },
        },
      }
    }

    case 'ANSWER_NOTES_CARD': {
      const keyCard = toShortISO(action.payload.utcDateTime)
      return {
        ...state,
        // @ts-expect-error TODO:
        notes: {
          ...state.notes,
          [keyCard]: {
            title: action.payload.title,
            notes: action.payload.notes,
            utcDateTime: action.payload.utcDateTime,
          },
        },
      }
    }

    default:
      return state
  }
}
