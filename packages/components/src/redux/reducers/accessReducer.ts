import { formatPassword, hash } from '../../services/auth'
import { Actions } from '../types'
import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'

export interface AccessState {
  storeCredentials: {
    [usernameHash: string]: {
      storeExists: boolean
      storeSalt: string
      verificationSalt: string
      passwordHash: string
    }
  }
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
    case 'CREATE_ACCOUNT_SUCCESS': {
      const storeSalt = uuidv4()
      const verificationSalt = uuidv4()
      const usernameHash = hash(action.payload.user.name)
      const password = formatPassword(action.payload.user.password)
      const passwordHash = hash(password + verificationSalt)

      return {
        ...state,
        lastLoggedInUsername: action.payload.user.name,
        storeCredentials: {
          ...state.storeCredentials,
          [usernameHash]: {
            storeExists: false,
            storeSalt,
            verificationSalt,
            passwordHash,
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

    case 'LOGIN_SUCCESS': {
      // TODO_ALEX Can just update keys here instead of via saga ?
      return state
    }

    default:
      return state
  }
}
