import _ from 'lodash'
import { combineReducers } from 'redux'
import { syncReducers } from '../sync'
import { Actions } from '../types'

import { analyticsReducer } from './analyticsReducer'
import { answerReducer } from './answerReducer'
import { appReducer } from './appReducer'
import { authReducer } from './authReducer'
import { contentReducer } from './contentReducer'
import { predictionReducer } from './predictionReducer'
import { accessReducer } from './accessReducer'
import { storeSwitchReducer } from './storeSwitchReducer'

export const exportReducerNames = ['app', 'prediction']

export const rootReducer = combineReducers(
  syncReducers(
    {
      access: accessReducer,
      storeSwitch: storeSwitchReducer,
      analytics: analyticsReducer,
      answer: answerReducer,
      app: appReducer,
      auth: authReducer,
      content: contentReducer,
      prediction: predictionReducer,
      // flower: flowerReducer, TODO: Flower state should be saved per user
    },
    exportReducerNames,
  ),
)

export type ReduxState = ReturnType<typeof rootReducer>
