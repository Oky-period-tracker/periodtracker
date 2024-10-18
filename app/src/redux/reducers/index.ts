import { combineReducers } from 'redux'
import { Actions } from '../types'

import { analyticsReducer, AnalyticsState } from './analyticsReducer'
import { LegacyAnswerState, legacyAnswerReducer } from './legacy/legacyAnswerReducer'
import { appReducer, AppState } from './appReducer'
import { authReducer, AuthState } from './authReducer'
import { contentReducer, ContentState } from './contentReducer'
import { legacyPredictionReducer, LegacyPredictionState } from './legacy/legacyPredictionReducer'
import { LegacyHelpCenterState, legacyHelpCenterReducer } from './legacy/legacyHelpCenterReducer'
import { privateReducer as defaultPrivateReducer, PrivateState } from './private/privateReducer'
import { RehydrateAction } from 'redux-persist'
import { PersistPartial } from 'redux-persist/es/persistReducer'

export type ReduxState = {
  app: AppState
  auth: AuthState
  content: ContentState
  analytics: AnalyticsState
  private: PrivateState
  // Legacy
  answer: LegacyAnswerState
  helpCenters: LegacyHelpCenterState
  prediction: LegacyPredictionState
}

export type RootReducerType = (state: ReduxState | undefined, action: Actions) => ReduxState

export const createRootReducer = ({
  privateReducer,
}: {
  privateReducer: (
    state: PrivateState & PersistPartial,
    action: Actions | RehydrateAction,
  ) => ReturnType<typeof defaultPrivateReducer>
}): RootReducerType => {
  return combineReducers({
    // Global
    app: appReducer,
    auth: authReducer,
    content: contentReducer,
    analytics: analyticsReducer,
    // Private
    private: privateReducer,
    // Legacy
    answer: legacyAnswerReducer,
    helpCenters: legacyHelpCenterReducer,
    prediction: legacyPredictionReducer,
  })
}
