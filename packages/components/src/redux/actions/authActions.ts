import { createAction } from '../helpers'

export function loginRequest({ name, password }) {
  return createAction('LOGIN_REQUEST', { name, password })
}

export function loginSuccess({
  appToken,
  user: {
    id,
    name,
    dateOfBirth,
    gender,
    location,
    country,
    province,
    password,
    secretQuestion,
    secretAnswer,
    dateSignedUp,
    isGuest,
  },
}) {
  return createAction('LOGIN_SUCCESS', {
    appToken,
    user: {
      id,
      name,
      dateOfBirth,
      gender,
      location,
      country,
      province,
      password,
      secretQuestion,
      secretAnswer,
      dateSignedUp,
      isGuest,
    },
  })
}

export function loginOfflineSuccess(payload: {
  keys: { key: string; secretKey: string }
  shouldMigrateData: boolean
}) {
  return createAction('LOGIN_OFFLINE_SUCCESS', payload)
}

export function setStoreKeys(payload: { key: string; secretKey: string }) {
  return createAction('SET_STORE_KEYS', payload)
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

export function createAccountRequest({
  id = null,
  name,
  dateOfBirth,
  gender,
  location,
  country,
  province,
  password,
  secretQuestion,
  secretAnswer,
}) {
  return createAction('CREATE_ACCOUNT_REQUEST', {
    id,
    name,
    dateOfBirth,
    gender,
    location,
    country,
    province,
    password,
    secretQuestion,
    secretAnswer,
  })
}
export function deleteAccountRequest({ name, password, setLoading }) {
  return createAction('DELETE_ACCOUNT_REQUEST', {
    name,
    password,
    setLoading,
  })
}

export function createAccountSuccess({
  appToken,
  user: {
    id,
    name,
    password,
    dateOfBirth,
    gender,
    location,
    country,
    province,
    secretQuestion,
    secretAnswer,
    dateSignedUp,
    isGuest,
  },
}) {
  return createAction('CREATE_ACCOUNT_SUCCESS', {
    appToken,
    user: {
      id,
      name,
      dateOfBirth,
      gender,
      location,
      country,
      province,
      password,
      secretQuestion,
      secretAnswer,
      dateSignedUp,
      isGuest,
    },
  })
}

export function createAccountFailure() {
  return createAction('CREATE_ACCOUNT_FAILURE')
}

export function convertGuestAccount({
  id,
  name,
  dateOfBirth,
  gender,
  location,
  country,
  province,
  password,
  secretQuestion,
  secretAnswer,
}) {
  return createAction('CONVERT_GUEST_ACCOUNT', {
    id,
    name,
    password,
    dateOfBirth,
    gender,
    location,
    country,
    province,
    secretQuestion,
    secretAnswer,
  })
}

export function editUser({
  name = null,
  dateOfBirth = null,
  gender = null,
  location = null,
  password = null,
  secretQuestion = null,
  secretAnswer = null,
}) {
  return createAction('EDIT_USER', {
    name,
    dateOfBirth,
    gender,
    location,
    password,
    secretQuestion,
    secretAnswer,
  })
}

export function journeyCompletion({ data = null }) {
  return createAction('JOURNEY_COMPLETION', { data })
}

export function setAuthError({ error }) {
  return createAction('SET_AUTH_ERROR', { error })
}
