import { REHYDRATE, RehydrateAction } from 'redux-persist'
import _ from 'lodash'
import { Actions } from '../types/index'

export interface LegacyUser {
  id: string
  name: string
  dateOfBirth: string
  gender: string
  location: string
  country: string
  province: string
  password: string
  secretQuestion: string
  secretAnswer: string
  dateSignedUp: string
  isGuest: boolean
  metadata: UserMetadata
}

export interface UserMetadata {
  hasMigrated: boolean
  // PH
  genderIdentity?: string
  accommodationRequirement?: string
  religion?: string
  contentSelection?: number
  city?: string
  isProfileUpdateSkipped?: boolean
}

export interface AuthState {
  error: string | number | null
  isCreatingAccount: boolean
  isLoggingIn: boolean
  loginFailedCount: number
  connectAccountAttempts: number
  // Legacy
  user: LegacyUser | null
  appToken: string | null
}

const initialState: AuthState = {
  error: null,
  isCreatingAccount: false,
  isLoggingIn: false,
  loginFailedCount: 0,
  connectAccountAttempts: 0,
  // Legacy
  user: null,
  appToken: null,
}

export function authReducer(state = initialState, action: Actions | RehydrateAction): AuthState {
  switch (action.type) {
    case REHYDRATE:
      return {
        // @ts-expect-error TODO:
        ...(action.payload && action.payload.auth),
        // reset state when store is re-hydrated
        ..._.pick(initialState, ['error', 'isLoggingIn', 'loginFailedCount', 'isCreatingAccount']),
      }

    case 'LOGIN_FAILURE':
      return {
        ...state,
        loginFailedCount: state.loginFailedCount + 1,
        error: action.payload.error,
        isLoggingIn: false,
      }

    case 'LOGOUT_CLEANUP':
      return {
        ...state,
        appToken: null,
        isLoggingIn: false,
        user: null,
      }

    case 'SET_AUTH_ERROR':
      return {
        ...state,
        error: action.payload.error,
      }

    case 'MIGRATE_STORE': {
      if (!state.user) {
        return state
      }

      return {
        ...state,
        user: {
          ...state.user,
          metadata: {
            ...state.user.metadata,
            hasMigrated: true,
          },
        },
      }
    }

    default:
      return state
  }
}
