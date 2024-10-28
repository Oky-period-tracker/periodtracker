import { ReduxState } from '../reducers'

const s = (state: ReduxState) => state.auth

export const legacyAppTokenSelector = (state: ReduxState) => s(state).appToken

export const legacyUserSelector = (state: ReduxState) => s(state).user
