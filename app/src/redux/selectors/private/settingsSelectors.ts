import { appTranslations, defaultLocale } from '../../../resources/translations'
import { ReduxState } from '../../reducers'

const s = (state: ReduxState) => state.private.settings

export const currentLocaleSelector = (state: ReduxState) => {
  const stateLocale = s(state)?.locale
  const locales = Object.keys(appTranslations)
  if (!stateLocale || !locales.includes(stateLocale)) {
    return defaultLocale
  }
  return stateLocale
}

export const currentThemeSelector = (state: ReduxState) => s(state).theme

export const currentAvatarSelector = (state: ReduxState) => s(state).avatar

export const isTutorialOneActiveSelector = (state: ReduxState) => s(state).isTutorialOneActive

export const isTutorialTwoActiveSelector = (state: ReduxState) => s(state).isTutorialTwoActive

export const dailyCardLastUsed = (state: ReduxState) => s(state)?.dailyCardLastUsed

export const isHapticActiveSelector = (state: ReduxState) => s(state).isHapticActive

export const isSoundActiveSelector = (state: ReduxState) => s(state).isSoundActive

export const lastPressedCardSelector = (state: ReduxState) => s(state).lastPressedCardDate

export const lastPressedEmojiSelector = (state: ReduxState) => s(state).lastPressedEmojiDate
