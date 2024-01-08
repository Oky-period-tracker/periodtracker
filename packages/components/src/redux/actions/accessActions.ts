import { createAction } from '../helpers'

export function saveLocalCredentials({
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
  return createAction('SAVE_LOCAL_CREDENTIALS', {
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

export function setStoreExists(payload: { usernameHash: string }) {
  return createAction('SET_STORE_EXISTS', payload)
}
