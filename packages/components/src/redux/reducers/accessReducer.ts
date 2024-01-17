import { Actions } from '../types'
import { v4 as uuidv4 } from 'uuid'
import _ from 'lodash'

export interface StoreCredentials {
  [usernameHash: string]: UserCredentials
}

export interface UserCredentials {
  userId: string
  storeSalt: string
  // password
  passwordSalt: string
  passwordHash: string
  // answer
  answerSalt: string
  answerHash: string
  // secretKey
  secretKeyEncryptedWithPassword: string
  secretKeyEncryptedWithAnswer: string
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
    case 'SET_COMMON_STATE':
      return {
        ...state,
        ...action.payload.access,
      }

    case 'SAVE_STORE_CREDENTIALS': {
      return {
        ...state,
        storeCredentials: {
          ...state.storeCredentials,
          [action.payload.usernameHash]: {
            userId: action.payload.userId,
            storeSalt: action.payload.storeSalt,
            answerSalt: action.payload.answerSalt,
            answerHash: action.payload.answerHash,
            passwordSalt: action.payload.passwordSalt,
            passwordHash: action.payload.passwordHash,
            secretKeyEncryptedWithPassword: action.payload.secretKeyEncryptedWithPassword,
            secretKeyEncryptedWithAnswer: action.payload.secretKeyEncryptedWithAnswer,
          },
        },
        userIdToUsernameHash: {
          ...state.userIdToUsernameHash,
          [action.payload.userId]: action.payload.usernameHash,
        },
      }
    }

    case 'EDIT_PASSWORD':
      return {
        ...state,
        storeCredentials: {
          ...state.storeCredentials,
          [action.payload.usernameHash]: {
            ...state.storeCredentials[action.payload.usernameHash],
            passwordSalt: action.payload.passwordSalt,
            passwordHash: action.payload.passwordHash,
            secretKeyEncryptedWithPassword: action.payload.secretKeyEncryptedWithPassword,
          },
        },
      }

    case 'SET_UP_NEW_STORE':
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
