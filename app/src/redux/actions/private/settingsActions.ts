import { AvatarName, ThemeName } from '../../../resources/translations'
import { createAction } from '../../helpers'

export function setTheme(theme: ThemeName) {
  return createAction('SET_THEME', { theme })
}

export function setAvatar(avatar: AvatarName) {
  return createAction('SET_AVATAR', { avatar })
}

export function setLocale(locale: string) {
  return createAction('SET_LOCALE', { locale })
}

export function setTutorialOneActive(isTutorialActive: boolean) {
  return createAction('SET_TUTORIAL_ONE_ACTIVE', { isTutorialActive })
}

export function setTutorialTwoActive(isTutorialActive: boolean) {
  return createAction('SET_TUTORIAL_TWO_ACTIVE', { isTutorialActive })
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
