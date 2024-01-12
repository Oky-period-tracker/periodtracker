import { Actions } from '../types'
import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'

export interface StoreCredentials {
  [usernameHash: string]: {
    storeExists: boolean
    storeSalt: string
    verificationSalt: string
    passwordHash: string
  }
}

export interface AccessState {
  storeCredentials: StoreCredentials
  lastLoggedInUsername?: string
  storeId: string
}

const initialState = (): AccessState => ({
  storeCredentials: {},
  lastLoggedInUsername: undefined,
  storeId: uuidv4(),
})

export function accessReducer(state = initialState(), action: Actions): AccessState {
  switch (action.type) {
    case 'SAVE_STORE_CREDENTIALS': {
      return {
        ...state,
        storeCredentials: {
          ...state.storeCredentials,
          [action.payload.usernameHash]: {
            ...state.storeCredentials[action.payload.usernameHash],
            storeExists: action.payload.storeExists,
            storeSalt: action.payload.storeSalt,
            verificationSalt: action.payload.verificationSalt,
            passwordHash: action.payload.passwordHash,
          },
        },
      }
    }

    case 'SET_STORE_EXISTS':
      return {
        ...state,
        storeCredentials: {
          ...state.storeCredentials,
          [action.payload.usernameHash]: {
            ...state.storeCredentials[action.payload.usernameHash],
            storeExists: true,
          },
        },
      }

    case 'INITIATE_STORE_SWITCH':
      return {
        ...state,
        lastLoggedInUsername: action.payload.username,
      }

    case 'CLEAR_LAST_LOGIN':
      return {
        ...state,
        lastLoggedInUsername: undefined,
      }

    case 'DELETE_USER_ACCESS':
      return {
        ...state,
        storeCredentials: _.omit(state.storeCredentials, action.payload.usernameHash),
      }

    default:
      return state
  }
}
