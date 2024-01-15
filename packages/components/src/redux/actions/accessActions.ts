import { createAction } from '../helpers'
import { StoreKeys } from '../reducers/storeSwitchReducer'

export function saveStoreCredentials(payload: {
  userId: string
  usernameHash: string
  storeSalt: string
  passwordSalt: string
  passwordHash: string
  answerSalt: string
  answerHash: string
  secretKeyEncryptedWithPassword: string
  secretKeyEncryptedWithAnswer: string
}) {
  return createAction('SAVE_STORE_CREDENTIALS', payload)
}

export function setStoreKeys(payload: { keys: StoreKeys }) {
  return createAction('SET_STORE_KEYS', payload)
}

export function clearLastLogin() {
  return createAction('CLEAR_LAST_LOGIN')
}

export function deleteUserAccess(payload: { usernameHash: string }) {
  return createAction('DELETE_USER_ACCESS', payload)
}

export function editPassword(payload: {
  usernameHash: string
  passwordSalt: string
  passwordHash: string
  secretKeyEncryptedWithPassword: string
}) {
  return createAction('EDIT_PASSWORD', payload)
}
