import { ReduxState } from '../reducers'

const s = (state: ReduxState) => state.app

export const hasOpenedSelector = (state: ReduxState) => s(state).hasOpened

export const isLoginPasswordActiveSelector = (state: ReduxState) => s(state).isLoginPasswordActive

export const currentAppVersion = (state: ReduxState) => s(state).appVersionName

export const currentFirebaseToken = (state: ReduxState) => s(state).firebaseToken

export const currentDeviceId = (state: ReduxState) => s(state)?.deviceId
