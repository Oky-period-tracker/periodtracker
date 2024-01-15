import { Actions } from '../types'
import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'

export interface StoreCredentials {
  [usernameHash: string]: UserCredentials
}

export interface UserCredentials {
  userId: string
  storeSalt: string
  passwordSalt: string
  passwordHash: string
  secretSalt: string
  secretHash: string
}

export interface UserIdToUsernameHash {
  [userId: string]: string
}

export interface AccessState {
  storeCredentials: StoreCredentials
  userIdToUsernameHash: UserIdToUsernameHash
  lastLoggedInUsername?: string
  storeId: string
}

const initialState = (): AccessState => ({
  storeCredentials: {},
  userIdToUsernameHash: {},
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
            userId: action.payload.userId,
            storeSalt: action.payload.storeSalt,
            secretSalt: action.payload.secretSalt,
            secretHash: action.payload.secretHash,
            passwordSalt: action.payload.passwordSalt,
            passwordHash: action.payload.passwordHash,
          },
        },
        userIdToUsernameHash: {
          ...state.userIdToUsernameHash,
          [action.payload.userId]: action.payload.usernameHash,
        },
      }
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
