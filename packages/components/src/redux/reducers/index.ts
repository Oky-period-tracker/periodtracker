import _ from 'lodash'
import { combineReducers } from 'redux'
import { Actions } from '../types'

import { analyticsReducer } from './analyticsReducer'
import { answerReducer } from './answerReducer'
import { appReducer } from './appReducer'
import { authReducer } from './authReducer'
import { contentReducer } from './contentReducer'
import { predictionReducer } from './predictionReducer'
import { CustomHelpCenter } from '../../optional/CustomComponents'

const reducer = combineReducers({
  analytics: analyticsReducer,
  answer: answerReducer,
  app: appReducer,
  auth: authReducer,
  content: contentReducer,
  prediction: predictionReducer,
  // Optional Modules
  helpCenters: CustomHelpCenter.reducer,
  // flower: flowerReducer, TODO: Flower state should be saved per user
})

export function rootReducer(state, action: Actions) {
  switch (action.type) {
    case 'LOGOUT':
      // @ts-ignore
      return reducer(_.pick(state, 'app', 'content', 'answer'), action)

    default:
      return reducer(state, action)
  }
}
