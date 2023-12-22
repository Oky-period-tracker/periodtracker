import { SecureReduxState } from '../reducers'

const s = (state: SecureReduxState) => state.app
const predictionS = (state: SecureReduxState) => state.prediction
export const currentLocaleSelector = (state: SecureReduxState) => s(state).locale

export const currentChosenRegionSelector = (state: SecureReduxState) => s(state).chosenRegion

export const currentThemeSelector = (state: SecureReduxState) => s(state).theme

export const currentAvatarSelector = (state: SecureReduxState) => s(state).avatar

export const hasOpenedSelector = (state: SecureReduxState) => s(state).hasOpened

export const isTutorialOneActiveSelector = (state: SecureReduxState) => s(state).isTutorialOneActive

export const isTutorialTwoActiveSelector = (state: SecureReduxState) => s(state).isTutorialTwoActive

export const isTtsActiveSelector = (state: SecureReduxState) => s(state).isTtsActive

export const isLoginPasswordActiveSelector = (state: SecureReduxState) =>
  s(state).isLoginPasswordActive

export const currentAppVersion = (state: SecureReduxState) => s(state).appVersionName

export const currentFirebaseToken = (state: SecureReduxState) => s(state).firebaseToken

export const userVerifiedDates = (state: SecureReduxState) => s(state).verifiedDates

// Smart precition selectors
export const isFuturePredictionSelector = (state: SecureReduxState) => predictionS(state)
export const isFuturePredictionActiveSelector = (state: SecureReduxState) =>
  predictionS(state)?.futurePredictionStatus

// export const smartPredictedPeriods = (state: SecureReduxState) => s(state).predicted_periods
