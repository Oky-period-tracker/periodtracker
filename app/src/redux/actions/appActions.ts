// import { AvatarName, ThemeName } from "@oky/core";
import { AvatarName, ThemeName } from '../../resources/translations'
import { createAction } from '../helpers'
import { PartialStateSnapshot } from '../types/partialStore'

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

export function setFuturePredictionActive(isFuturePredictionActive: boolean) {
  return createAction('SET_FUTURE_PREDICTION_ACTIVE', {
    isFuturePredictionActive,
  })
}

export function refreshStore(
  payload: {
    userID: string
  } & PartialStateSnapshot,
) {
  return createAction('REFRESH_STORE', payload)
}

export function toggleHaptic(isHapticActive: boolean) {
  return createAction('TOGGLE_HAPTIC', { isHapticActive })
}

export function toggleSound(isSoundActive: boolean) {
  return createAction('TOGGLE_SOUND', { isSoundActive })
}

export const updateLastPressedCardDate = (
  date: string, // YYYY-MM-DD
) => {
  return createAction('UPDATE_LAST_PRESSED_CARD_DATE', date)
}

export const updateLastPressedEmojiDate = (
  date: string, // YYYY-MM-DD
) => {
  return createAction('UPDATE_LAST_PRESSED_EMOJI_DATE', date)
}
