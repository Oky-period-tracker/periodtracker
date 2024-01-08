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

const reducer = combineReducers(
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

export function rootReducer(state, action: Actions) {
  switch (action.type) {
    case 'LOGOUT':
      // @ts-ignore
      return reducer(_.pick(state, 'app', 'content', 'answer', 'access'), action)

    default:
      return reducer(state, action)
  }
}

export type ReduxState = ReturnType<typeof rootReducer>
