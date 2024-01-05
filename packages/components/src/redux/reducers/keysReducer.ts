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
  migrationComplete: boolean
}

const initialState: KeysState = {
  keys: undefined,
  shouldMigrateData: true,
  migrationComplete: false,
}

export function keysReducer(state = initialState, action: Actions): KeysState {
  switch (action.type) {
    case 'MIGRATE_STORE':
      return {
        ...state,
        migrationComplete: true,
      }

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
