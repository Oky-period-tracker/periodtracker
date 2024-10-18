import { createAction } from '../helpers'
import { PartialStateSnapshot } from '../types/partialStore'

export function setUpdatedVersion() {
  return createAction('SET_UPDATED_VERSION')
}

export function setHasOpened(hasOpened: boolean) {
  return createAction('SET_HAS_OPENED', { hasOpened })
}

export function setLoginPassword(isLoginPasswordActive: boolean) {
  return createAction('SET_LOGIN_PASSWORD_ACTIVE', { isLoginPasswordActive })
}

export function refreshStore(
  payload: {
    userID: string
  } & PartialStateSnapshot,
) {
  return createAction('REFRESH_STORE', payload)
}
