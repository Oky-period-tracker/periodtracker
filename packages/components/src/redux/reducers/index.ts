import _ from 'lodash'
import { combineReducers } from 'redux'
import { Actions } from '../types'

import { analyticsReducer } from './analyticsReducer'
import { answerReducer } from './answerReducer'
import { appReducer } from './appReducer'
import { authReducer } from './authReducer'
import { contentReducer } from './contentReducer'
import { predictionReducer } from './predictionReducer'
import { accessReducer } from './accessReducer'
import { storeSwitchReducer } from './storeSwitchReducer'

export const allReducers = {
  access: accessReducer,
  storeSwitch: storeSwitchReducer,
  analytics: analyticsReducer,
  answer: answerReducer,
  app: appReducer,
  auth: authReducer,
  content: contentReducer,
  prediction: predictionReducer,
  // flower: flowerReducer, TODO: Flower state should be saved per user
}

export const rootReducer = combineReducers(allReducers)

export type ReduxState = ReturnType<typeof rootReducer>

export type ReduxStateProperties = keyof ReduxState
