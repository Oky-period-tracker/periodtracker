import { combineReducers } from 'redux'

import { userReducer, UserState } from './userReducer'
import { settingsReducer, SettingsState } from './settingsReducer'
import { Actions } from '../../types'
import { RehydrateAction } from 'redux-persist'
import { helpCenterReducer, HelpCenterState } from './helpCenterReducer'
import { predictionReducer, PredictionState } from './predictionReducer'
import { answerReducer, AnswerState } from './answerReducer'
import { lastModifiedReducer } from './lastModifiedReducer'

export type PrivateState = {
  lastModified: number
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
  lastModified: lastModifiedReducer,
  user: userReducer,
  answer: answerReducer,
  prediction: predictionReducer,
  settings: settingsReducer,
  helpCenters: helpCenterReducer,
})
