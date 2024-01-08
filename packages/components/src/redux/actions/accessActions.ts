import { createAction } from '../helpers'

export function setStoreExists(payload: { usernameHash: string }) {
  return createAction('SET_STORE_EXISTS', payload)
}
