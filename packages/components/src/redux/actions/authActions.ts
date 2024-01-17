import { createAction } from '../helpers'
import { StoreKeys } from '../reducers/storeSwitchReducer'

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
      isGuest,
    },
  })
}

export function setUpNewStore(payload: {
  userId: string
  username: string
  password: string
  answer: string
}) {
  return createAction('SET_UP_NEW_STORE', payload)
}

export function initiateStoreSwitch(payload: { username: string; password: string }) {
  return createAction('INITIATE_STORE_SWITCH', payload)
}

export function loginFailure({ error }) {
  return createAction('LOGIN_FAILURE', { error })
}

export function logoutRequest() {
  return createAction('LOGOUT_REQUEST')
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
  oldUsernameHash,
  newUsernameHash,
  user: {
    name = null,
    dateOfBirth = null,
    gender = null,
    location = null,
    password = null,
    secretQuestion = null,
    secretAnswer = null,
  },
}) {
  return createAction('EDIT_USER', {
    oldUsernameHash,
    newUsernameHash,
    user: {
      name,
      dateOfBirth,
      gender,
      location,
      password,
      secretQuestion,
      secretAnswer,
    },
  })
}

export function journeyCompletion({ data = null }) {
  return createAction('JOURNEY_COMPLETION', { data })
}

export function setAuthError({ error }) {
  return createAction('SET_AUTH_ERROR', { error })
}
