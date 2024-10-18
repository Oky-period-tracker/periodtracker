import { combineReducers } from 'redux'
import { Actions } from '../types'

import { analyticsReducer, AnalyticsState } from './analyticsReducer'
import { answerReducer, AnswerState } from './answerReducer'
import { appReducer, AppState } from './appReducer'
import { authReducer, AuthState } from './authReducer'
import { contentReducer, ContentState } from './contentReducer'
import { predictionReducer, PredictionState } from './predictionReducer'
import { helpCenterReducer, HelpCenterState } from './helpCenterReducer'
import { privateReducer as defaultPrivateReducer, PrivateState } from './privateReducer'
import { RehydrateAction } from 'redux-persist'
import { PersistPartial } from 'redux-persist/es/persistReducer'

export type ReduxState = {
  analytics: AnalyticsState
  answer: AnswerState
  app: AppState
  auth: AuthState
  content: ContentState
  prediction: PredictionState
  helpCenters: HelpCenterState
  private: PrivateState
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
    analytics: analyticsReducer,
    answer: answerReducer,
    app: appReducer,
    auth: authReducer,
    content: contentReducer,
    prediction: predictionReducer,
    helpCenters: helpCenterReducer,
    private: privateReducer,
  })
}
