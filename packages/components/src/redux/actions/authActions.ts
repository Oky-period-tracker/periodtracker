import { createAction } from '../helpers'
import { User } from '../reducers/authReducer'

export function loginRequest({ name, password }) {
  return createAction('LOGIN_REQUEST', { name, password })
}

export function loginSuccess(payload: { appToken?: string; user: User }) {
  return createAction('LOGIN_SUCCESS', payload)
}

export function loginSuccessAsGuestAccount(payload: User) {
  return createAction('LOGIN_SUCCESS_AS_GUEST_ACCOUNT', payload)
}

export function loginFailure({ error }) {
  return createAction('LOGIN_FAILURE', { error })
}

export function logoutRequest() {
  return createAction('LOGOUT_REQUEST')
}

export function logout() {
  return createAction('LOGOUT')
}

export function createAccountRequest(payload: User) {
  return createAction('CREATE_ACCOUNT_REQUEST', payload)
}
export function deleteAccountRequest({ name, password, setLoading }) {
  return createAction('DELETE_ACCOUNT_REQUEST', {
    name,
    password,
    setLoading,
  })
}

export function createAccountSuccess(payload: { appToken?: string; user: User }) {
  return createAction('CREATE_ACCOUNT_SUCCESS', payload)
}

export function createAccountFailure() {
  return createAction('CREATE_ACCOUNT_FAILURE')
}

export function convertGuestAccount(payload: User) {
  return createAction('CONVERT_GUEST_ACCOUNT', payload)
}

export function editUser(payload: Partial<User>) {
  return createAction('EDIT_USER', payload)
}

export function journeyCompletion({ data = null }) {
  return createAction('JOURNEY_COMPLETION', { data })
}

export function setAuthError({ error }) {
  return createAction('SET_AUTH_ERROR', { error })
}
