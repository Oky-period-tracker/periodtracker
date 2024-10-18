import { combineReducers } from 'redux'

import { userReducer, UserState } from './userReducer'
import { settingsReducer, SettingsState } from './settingsReducer'
import { Actions } from '../../types'
import { RehydrateAction } from 'redux-persist'
import { helpCenterReducer, HelpCenterState } from './helpCenterReducer'
import { predictionReducer, PredictionState } from './predictionReducer'
import { answerReducer, AnswerState } from './answerReducer'

export type PrivateState = {
  user: UserState
  answer: AnswerState
  prediction: PredictionState
  settings: SettingsState
  helpCenters: HelpCenterState
}

export const privateReducer: (
  state: PrivateState | undefined,
  action: Actions | RehydrateAction,
) => PrivateState = combineReducers({
  user: userReducer,
  answer: answerReducer,
  prediction: predictionReducer,
  settings: settingsReducer,
  helpCenters: helpCenterReducer,
})
