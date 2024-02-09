import { AvatarName, ThemeName } from '@oky/core'
import { createAction } from '../helpers'

export function setTheme(theme: ThemeName) {
  return createAction('SET_THEME', { theme })
}

export function setAvatar(avatar: AvatarName) {
  return createAction('SET_AVATAR', { avatar })
}

export function setLocale(locale: string) {
  return createAction('SET_LOCALE', { locale })
}

export function setUpdatedVersion() {
  return createAction('SET_UPDATED_VERSION')
}

export function requestStoreFirebaseKey() {
  return createAction('REQUEST_STORE_FIREBASE_KEY')
}

export function storeFirebaseKey(firebaseToken: string) {
  return createAction('STORE_FIREBASE_KEY', { firebaseToken })
}

export function setChosenRegion(region: string) {
  return createAction('SET_CHOSEN_REGION', { region })
}

export function setHasOpened(hasOpened: boolean) {
  return createAction('SET_HAS_OPENED', { hasOpened })
}

export function setTutorialOneActive(isTutorialActive: boolean) {
  return createAction('SET_TUTORIAL_ONE_ACTIVE', { isTutorialActive })
}

export function setTutorialTwoActive(isTutorialActive: boolean) {
  return createAction('SET_TUTORIAL_TWO_ACTIVE', { isTutorialActive })
}

export function setLoginPassword(isLoginPasswordActive: boolean) {
  return createAction('SET_LOGIN_PASSWORD_ACTIVE', { isLoginPasswordActive })
}

export function setTtsActive(isTtsActive: boolean) {
  return createAction('SET_TTS_ACTIVE', { isTtsActive })
}

export function setFuturePredictionActive(isFuturePredictionActive: boolean) {
  return createAction('SET_FUTURE_PREDICTION_ACTIVE', { isFuturePredictionActive })
}

export function refreshStore(appState: any) {
  return createAction('REFRESH_STORE', appState)
}

export function syncStore() {
  return createAction('SYNC_STORE')
}

export function verifyPeriodDayByUser(date: any) {
  return createAction('VERIFY_PERIOD_DAY', { date })
}
