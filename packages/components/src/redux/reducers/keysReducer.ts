import { Actions } from '../types'
import _ from 'lodash'

export interface KeysState {
  keys:
    | {
        key: string
        secretKey: string
      }
    | undefined

  shouldMigrateData: boolean
}

const initialState: KeysState = {
  keys: undefined,
  shouldMigrateData: false,
}

export function keysReducer(state = initialState, action: Actions): KeysState {
  switch (action.type) {
    case 'SET_STORE_KEYS':
      return {
        ...state,
        keys: action.payload,
      }

    case 'LOGIN_OFFLINE_SUCCESS':
      return {
        ...state,
        keys: action.payload.keys,
        shouldMigrateData: action.payload.shouldMigrateData,
      }

    default:
      return state
  }
}
