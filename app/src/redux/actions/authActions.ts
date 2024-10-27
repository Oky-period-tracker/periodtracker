import { User, UserCredentials } from '../../types'
import { createAction } from '../helpers'

// @ts-expect-error TODO:
export function loginRequest({ name, password }) {
  return createAction('LOGIN_REQUEST', { name, password })
}

export function loginSuccess(payload: { appToken?: string; user: User }) {
  return createAction('LOGIN_SUCCESS', payload)
}

export function loginSuccessAsGuestAccount(payload: User) {
  return createAction('LOGIN_SUCCESS_AS_GUEST_ACCOUNT', payload)
}

export function loginFailure(payload: { error: string | number | null }) {
  return createAction('LOGIN_FAILURE', payload)
}

export function logout() {
  return createAction('LOGOUT')
}

export function logoutCleanup() {
  return createAction('LOGOUT_CLEANUP')
}

export function createAccountRequest(payload: User) {
  return createAction('CREATE_ACCOUNT_REQUEST', payload)
}

// @ts-expect-error TODO:
export function deleteAccountRequest({ name, password /* , setLoading */ }) {
  return createAction('DELETE_ACCOUNT_REQUEST', {
    name,
    password,
    // setLoading,
  })
}

export function createAccountSuccess(payload: { appToken?: string; user: User }) {
  return createAction('CREATE_ACCOUNT_SUCCESS', payload)
}

export function createAccountFailure() {
  return createAction('CREATE_ACCOUNT_FAILURE')
}

export function convertGuestAccount(payload: User & UserCredentials) {
  return createAction('CONVERT_GUEST_ACCOUNT', payload)
}

export function editUser(payload: Partial<User>) {
  return createAction('EDIT_USER', payload)
}

export function journeyCompletion(payload: {
  isActive: boolean
  startDate: moment.Moment
  periodLength: number
  cycleLength: number
}) {
  return createAction('JOURNEY_COMPLETION', payload)
}

// @ts-expect-error TODO:
export function setAuthError({ error }) {
  return createAction('SET_AUTH_ERROR', { error })
}
