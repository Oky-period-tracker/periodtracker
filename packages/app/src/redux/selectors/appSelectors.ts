import { ReduxState } from '../store'

const s = (state: ReduxState) => state.app
const predictionS = (state: ReduxState) => state.prediction
export const currentLocaleSelector = (state: ReduxState) => s(state).locale

export const currentChosenRegionSelector = (state: ReduxState) => s(state).chosenRegion

export const currentThemeSelector = (state: ReduxState) => s(state).theme

export const currentAvatarSelector = (state: ReduxState) => s(state).avatar

export const hasOpenedSelector = (state: ReduxState) => s(state).hasOpened

export const isTutorialOneActiveSelector = (state: ReduxState) => s(state).isTutorialOneActive

export const isTutorialTwoActiveSelector = (state: ReduxState) => s(state).isTutorialTwoActive

export const isTtsActiveSelector = (state: ReduxState) => s(state).isTtsActive

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
