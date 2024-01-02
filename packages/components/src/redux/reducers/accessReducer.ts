import { hash } from '../../services/hash'
import { Actions } from '../types'
import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'

export interface AccessState {
  storeCredentials: {
    [usernameHash: string]: {
      passwordSalt: string
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
      const usernameHash = hash(action.payload.user.name)
      const passwordSalt = uuidv4()

      return {
        ...state,
        lastLoggedInUsername: action.payload.user.name,
        storeCredentials: {
          ...state.storeCredentials,
          [usernameHash]: {
            passwordSalt,
          },
        },
      }
    }

    case 'CREATE_GUEST_ACCOUNT_SUCCESS': {
      const usernameHash = hash(action.payload.name)
      const passwordSalt = uuidv4()

      return {
        ...state,
        lastLoggedInUsername: action.payload.name,
        storeCredentials: {
          ...state.storeCredentials,
          [usernameHash]: {
            passwordSalt,
          },
        },
      }
    }

    case 'LOGIN_SUCCESS': {
      // TODO_ALEX Can just update keys here instead of via saga ?
      return state
    }

    default:
      return state
  }
}
