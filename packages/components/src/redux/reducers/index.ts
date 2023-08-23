import _ from 'lodash'
import { combineReducers } from 'redux'
import { syncReducers } from '../sync'
import { Actions } from '../types'

import { analyticsReducer } from './analyticsReducer'
import { answerReducer } from './answerReducer'
import { appReducer } from './appReducer'
import { authReducer } from './authReducer'
import { chatReducer } from './chatReducer'
import { contentReducer } from './contentReducer'
import { predictionReducer } from './predictionReducer'

export const exportReducerNames = ['app', 'prediction']

const reducer = combineReducers(
  syncReducers(
    {
      analytics: analyticsReducer,
      answer: answerReducer,
      app: appReducer,
      auth: authReducer,
      chat: chatReducer,
      content: contentReducer,
      prediction: predictionReducer,
    },
    exportReducerNames,
  ),
)

export function rootReducer(state, action: Actions) {
  switch (action.type) {
    case 'LOGOUT':
      // @ts-ignore
      return reducer(_.pick(state, 'app', 'content', 'answer'), action)

    default:
      return reducer(state, action)
  }
}
