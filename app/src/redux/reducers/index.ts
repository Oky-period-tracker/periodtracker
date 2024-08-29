import _ from 'lodash'
import { combineReducers } from 'redux'
import { Actions } from '../types'

import { analyticsReducer } from './analyticsReducer'
import { answerReducer } from './answerReducer'
import { appReducer } from './appReducer'
import { authReducer } from './authReducer'
import { contentReducer } from './contentReducer'
import { predictionReducer } from './predictionReducer'
import { helpCenterReducer } from './helpCenterReducer'

const reducer = combineReducers({
  analytics: analyticsReducer,
  answer: answerReducer,
  app: appReducer,
  auth: authReducer,
  content: contentReducer,
  prediction: predictionReducer,
  helpCenters: helpCenterReducer,
  // Optional Modules
  // flower: flowerReducer, TODO: Flower state should be saved per user
})

// @ts-expect-error TODO:
export function rootReducer(state, action: Actions) {
  switch (action.type) {
    case 'LOGOUT':
      return reducer(_.pick(state, 'app', 'content', 'answer'), action)

    default:
      return reducer(state, action)
  }
}

export type ReduxState = ReturnType<typeof rootReducer>
