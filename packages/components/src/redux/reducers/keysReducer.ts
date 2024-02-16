import { Actions } from '../types'
import _ from 'lodash'

export interface KeysState {
  keys:
    | {
        key: string
        secretKey: string
      }
    | undefined
}

const initialState: KeysState = {
  keys: undefined,
}

export function keysReducer(state = initialState, action: Actions): KeysState {
  switch (action.type) {
    case 'SET_STORE_KEYS':
      return {
        ...state,
        keys: action.payload,
      }

    default:
      return state
  }
}
