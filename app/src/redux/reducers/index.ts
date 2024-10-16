import { combineReducers } from 'redux'
import { Actions } from '../types'

import { analyticsReducer, AnalyticsState } from './analyticsReducer'
import { answerReducer, AnswerState } from './answerReducer'
import { appReducer, AppState } from './appReducer'
import { authReducer, AuthState } from './authReducer'
import { contentReducer, ContentState } from './contentReducer'
import { predictionReducer, PredictionState } from './predictionReducer'
import { helpCenterReducer, HelpCenterState } from './helpCenterReducer'
import { userReducer as defaultUserReducer, UserState } from './userReducer'
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
  user: UserState
}

export type RootReducerType = (state: ReduxState | undefined, action: Actions) => ReduxState

export const createRootReducer = ({
  userReducer,
}: {
  userReducer: (
    state: UserState & PersistPartial,
    action: Actions | RehydrateAction,
  ) => ReturnType<typeof defaultUserReducer>
}): RootReducerType => {
  return combineReducers({
    analytics: analyticsReducer,
    answer: answerReducer,
    app: appReducer,
    auth: authReducer,
    content: contentReducer,
    prediction: predictionReducer,
    helpCenters: helpCenterReducer,
    // Private & secure user data
    user: userReducer,
  })
}
