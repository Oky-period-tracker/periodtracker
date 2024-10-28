import { omit } from 'lodash'
import { ReduxState } from '../reducers'
import { PrivateState } from '../reducers/private/privateReducer'

const s = (state: ReduxState) => state.auth

export const legacyAppTokenSelector = (state: ReduxState) => s(state).appToken

export const legacyUserSelector = (state: ReduxState) => s(state).user

export const legacyPrivateStateSelector = (state: ReduxState): PrivateState | undefined => {
  const userId = state.auth.user?.id

  if (!userId || !state.auth.user) {
    return undefined
  }

  return {
    lastModified: Date.now(),
    user: {
      user: {
        ...omit(state.auth.user, 'password', 'secretAnswer'),
      },
      appToken: state.auth.appToken,
    },
    answer: {
      allSurveys: [],
      completedSurveys: [],
      quizzes: state.answer?.[userId]?.quizzes,
      cards: state.answer?.[userId]?.cards,
      verifiedDates: state.answer?.[userId]?.verifiedDates,
      notes: state.answer?.[userId]?.notes,
    },
    prediction: state.prediction,
    settings: {
      locale: state.app.locale,
      isTutorialOneActive: state.app.isTutorialOneActive,
      isTutorialTwoActive: state.app.isTutorialTwoActive,
      isFuturePredictionActive: state.app.isFuturePredictionActive,
      theme: state.app.theme,
      avatar: state.app.avatar,
      isHapticActive: state.app.isHapticActive,
      isSoundActive: state.app.isSoundActive,
      lastPressedCardDate: state.app.lastPressedCardDate,
      lastPressedEmojiDate: state.app.lastPressedEmojiDate,
    },
    helpCenters: state.helpCenters,
  }
}
