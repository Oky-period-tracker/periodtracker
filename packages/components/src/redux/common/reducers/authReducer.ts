import { REHYDRATE, RehydrateAction } from 'redux-persist'
import _ from 'lodash'
import { Actions } from '../types/index'

export interface User {
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
  isGuest: boolean
}

export interface AuthState {
  appToken: string | null
  error: string | null
  isCreatingAccount: boolean
  isLoggingIn: boolean
  loginFailedCount: number
  connectAccountAttempts: number
  user: User | null
}

const initialState: AuthState = {
  appToken: null,
  error: null,
  isCreatingAccount: false,
  isLoggingIn: false,
  loginFailedCount: 0,
  connectAccountAttempts: 0,
  user: null,
}

export function authReducer(state = initialState, action: Actions | RehydrateAction): AuthState {
  switch (action.type) {
    case REHYDRATE:
      return {
        ...(action.payload && action.payload.auth),
        // reset state when store is re-hydrated
        ..._.pick(initialState, ['error', 'isLoggingIn', 'loginFailedCount', 'isCreatingAccount']),
      }

    case 'LOGIN_REQUEST':
      return {
        ...state,
        error: null,
        isLoggingIn: true,
      }

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        appToken: action.payload.appToken,
        error: null,
        isLoggingIn: false,
        loginFailedCount: 0,
        connectAccountAttempts: 0,
        user: {
          id: action.payload.user.id,
          name: action.payload.user.name,
          dateOfBirth: action.payload.user.dateOfBirth,
          gender: action.payload.user.gender,
          location: action.payload.user.location,
          country: action.payload.user.country,
          province: action.payload.user.province,
          password: action.payload.user.password,
          secretQuestion: action.payload.user.secretQuestion,
          secretAnswer: action.payload.user.secretAnswer,
          isGuest: false,
        },
      }

    case 'LOGIN_SUCCESS_AS_GUEST_ACCOUNT':
      return {
        ...state,
        appToken: null,
        isLoggingIn: false,
        loginFailedCount: 0,
        user: {
          id: action.payload.id,
          name: action.payload.name,
          dateOfBirth: action.payload.dateOfBirth,
          gender: action.payload.gender,
          location: action.payload.location,
          country: action.payload.country,
          province: action.payload.province,
          password: action.payload.password,
          secretQuestion: action.payload.secretQuestion,
          secretAnswer: action.payload.secretAnswer,
          isGuest: true,
        },
      }

    case 'LOGIN_FAILURE':
      return {
        ...state,
        appToken: null,
        loginFailedCount: state.loginFailedCount + 1,
        error: action.payload.error,
        isLoggingIn: false,
        user: null,
      }

    case 'LOGOUT':
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

    case 'CREATE_ACCOUNT_REQUEST':
      return {
        ...state,
        isCreatingAccount: true,
        error: null,
      }

    case 'CREATE_ACCOUNT_SUCCESS':
      return {
        ...state,
        isCreatingAccount: false,
      }

    case 'CREATE_ACCOUNT_FAILURE':
      return {
        ...state,
        connectAccountAttempts: state.connectAccountAttempts + 1,
        isCreatingAccount: false,
      }

    case 'EDIT_USER':
      return {
        ...state,
        user: { ...state.user, ..._.omitBy(action.payload, _.isNil) },
      }

    default:
      return state
  }
}
