import { assets } from '../../resources/assets'
import {
  appTranslations,
  defaultAvatar,
  defaultLocale,
  defaultTheme,
} from '../../resources/translations'
import { ReduxState } from '../reducers'

const s = (state: ReduxState) => state.app
const predictionS = (state: ReduxState) => state.prediction

export const currentLocaleSelector = (state: ReduxState) => {
  const stateLocale = s(state)?.locale
  const locales = Object.keys(appTranslations)
  if (!stateLocale || !locales.includes(stateLocale)) {
    return defaultLocale
  }
  return stateLocale
}

export const currentThemeSelector = (state: ReduxState) => {
  const stateTheme = s(state)?.theme
  const themes = Object.keys(assets.backgrounds)
  if (!stateTheme || !themes.includes(stateTheme)) {
    return defaultTheme
  }
  return stateTheme
}

export const currentAvatarSelector = (state: ReduxState) => {
  const stateAvatar = s(state)?.avatar
  const avatars = Object.keys(assets.avatars)
  if (!stateAvatar || !avatars.includes(stateAvatar)) {
    return defaultAvatar
  }
  return stateAvatar
}

export const hasOpenedSelector = (state: ReduxState) => s(state).hasOpened

export const isTutorialOneActiveSelector = (state: ReduxState) => s(state).isTutorialOneActive

export const isTutorialTwoActiveSelector = (state: ReduxState) => s(state).isTutorialTwoActive

export const isLoginPasswordActiveSelector = (state: ReduxState) => s(state).isLoginPasswordActive

export const currentAppVersion = (state: ReduxState) => s(state).appVersionName

export const currentFirebaseToken = (state: ReduxState) => s(state).firebaseToken

export const userVerifiedDates = (state: ReduxState) => s(state).verifiedDates

// Smart precition selectors
export const isFuturePredictionSelector = (state: ReduxState) => predictionS(state)
export const isFuturePredictionActiveSelector = (state: ReduxState) =>
  predictionS(state)?.futurePredictionStatus

// export const smartPredictedPeriods = (state: ReduxState) => s(state).predicted_periods

export const currentDeviceId = (state: ReduxState) => s(state)?.deviceId

export const dailyCardLastUsed = (state: ReduxState) => s(state)?.dailyCardLastUsed

export const isHapticActiveSelector = (state: ReduxState) => s(state).isHapticActive

export const isSoundActiveSelector = (state: ReduxState) => s(state).isSoundActive

export const lastPressedCardSelector = (state: ReduxState) => s(state).lastPressedCardDate

export const lastPressedEmojiSelector = (state: ReduxState) => s(state).lastPressedEmojiDate
