import _ from 'lodash'
import { combineReducers } from 'redux'
import { syncReducers } from '../sync'
import { CommonActions } from '../types'

import { analyticsReducer } from './analyticsReducer'
import { answerReducer } from './answerReducer'
import { appReducer } from './appReducer'
import { authReducer } from './authReducer'
import { contentReducer } from './contentReducer'
import { predictionReducer } from './predictionReducer'
import { accessReducer } from './accessReducer'
import { keysReducer } from './keysReducer'

export const exportReducerNames = ['app', 'prediction']

const reducer = combineReducers(
  syncReducers(
    {
      keys: keysReducer,
      access: accessReducer,
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

export function commonRootReducer(state, action: CommonActions) {
  switch (action.type) {
    case 'LOGOUT':
      // @ts-ignore
      return reducer(_.pick(state, 'app', 'content', 'answer', 'access'), action)

    default:
      return reducer(state, action)
  }
}

export type CommonReduxState = ReturnType<typeof commonRootReducer>
