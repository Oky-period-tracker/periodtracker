import _ from 'lodash'
import { combineReducers } from 'redux'
import { syncReducers } from '../sync'
import { analyticsReducer } from './analyticsReducer'
import { answerReducer } from './answerReducer'
import { appReducer } from './appReducer'
import { authReducer } from './authReducer'
import { contentReducer } from './contentReducer'
import { predictionReducer } from './predictionReducer'
import { accessReducer } from './accessReducer'
import { storeSwitchReducer } from './storeSwitchReducer'
import { Actions } from '../types'

export const exportReducerNames = ['app', 'prediction']

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

const reducer = combineReducers(syncReducers(allReducers, exportReducerNames))

export function rootReducer(state, action: Actions) {
  switch (action.type) {
    case 'MIGRATE_STORE':
      return {
        ...state,
        // @ts-ignore
        ...action.payload,
        storeSwitch: {
          ...state.storeSwitch,
          migrationComplete: true,
        },
      }

    default:
      return reducer(state, action)
  }
}

export type ReduxState = ReturnType<typeof rootReducer>

export type ReduxStateProperties = keyof ReduxState
