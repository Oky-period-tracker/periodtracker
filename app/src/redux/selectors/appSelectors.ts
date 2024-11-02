import { appTranslations, defaultLocale } from '../../resources/translations'
import { ReduxState } from '../reducers'

const s = (state: ReduxState) => state.app

export const appLocaleSelector = (state: ReduxState) => {
  // The locale to use when logged out
  const stateLocale = s(state)?.locale
  const locales = Object.keys(appTranslations)
  if (!stateLocale || !locales.includes(stateLocale)) {
    return defaultLocale
  }
  return stateLocale
}

export const hasOpenedSelector = (state: ReduxState) => s(state).hasOpened

export const isLoginPasswordActiveSelector = (state: ReduxState) => s(state).isLoginPasswordActive

export const currentAppVersion = (state: ReduxState) => s(state).appVersionName

export const currentDeviceId = (state: ReduxState) => s(state)?.deviceId

export const lastLoggedInUsernameSelector = (state: ReduxState) => s(state)?.lastLoggedInUsername
