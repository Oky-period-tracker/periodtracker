import { createAction } from '../helpers'
import { StoreKeys } from '../reducers/storeSwitchReducer'

export function saveStoreCredentials(payload: {
  usernameHash: string
  storeExists: boolean
  storeSalt: string
  verificationSalt: string
  passwordHash: string
}) {
  return createAction('SAVE_STORE_CREDENTIALS', payload)
}

export function setStoreKeys(payload: { keys: StoreKeys }) {
  return createAction('SET_STORE_KEYS', payload)
}

export function setStoreExists(payload: { usernameHash: string }) {
  return createAction('SET_STORE_EXISTS', payload)
}

export function clearLastLogin() {
  return createAction('CLEAR_LAST_LOGIN')
}

export function deleteUserAccess(payload: { usernameHash: string }) {
  return createAction('DELETE_USER_ACCESS', payload)
}
