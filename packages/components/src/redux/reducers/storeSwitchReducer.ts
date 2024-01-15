import { Actions } from '../types'

export interface StoreKeys {
  key: string
  secretKey: string
}

export interface StoreSwitchState {
  keys: StoreKeys | undefined
  migrationComplete: boolean
}

const initialState: StoreSwitchState = {
  keys: undefined,
  migrationComplete: false,
}

export function storeSwitchReducer(state = initialState, action: Actions): StoreSwitchState {
  switch (action.type) {
    case 'SET_STORE_KEYS':
      return {
        ...state,
        keys: action.payload.keys,
      }

    default:
      return state
  }
}
