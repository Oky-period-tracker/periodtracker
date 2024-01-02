import { CommonReduxState } from '../reducers'

const s = (state: CommonReduxState) => state.app
const predictionS = (state: CommonReduxState) => state.prediction
export const currentLocaleSelector = (state: CommonReduxState) => s(state).locale

export const currentChosenRegionSelector = (state: CommonReduxState) => s(state).chosenRegion

export const currentThemeSelector = (state: CommonReduxState) => s(state).theme

export const currentAvatarSelector = (state: CommonReduxState) => s(state).avatar

export const hasOpenedSelector = (state: CommonReduxState) => s(state).hasOpened

export const isTutorialOneActiveSelector = (state: CommonReduxState) => s(state).isTutorialOneActive

export const isTutorialTwoActiveSelector = (state: CommonReduxState) => s(state).isTutorialTwoActive

export const isTtsActiveSelector = (state: CommonReduxState) => s(state).isTtsActive

export const isLoginPasswordActiveSelector = (state: CommonReduxState) =>
  s(state).isLoginPasswordActive

export const currentAppVersion = (state: CommonReduxState) => s(state).appVersionName

export const currentFirebaseToken = (state: CommonReduxState) => s(state).firebaseToken

export const userVerifiedDates = (state: CommonReduxState) => s(state).verifiedDates

// Smart precition selectors
export const isFuturePredictionSelector = (state: CommonReduxState) => predictionS(state)
export const isFuturePredictionActiveSelector = (state: CommonReduxState) =>
  predictionS(state)?.futurePredictionStatus

// export const smartPredictedPeriods = (state: CommonReduxState) => s(state).predicted_periods
