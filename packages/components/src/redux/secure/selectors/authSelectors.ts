import { SecureReduxState } from '../reducers'

const s = (state: SecureReduxState) => state.auth

export const appTokenSelector = (state: SecureReduxState) => s(state).appToken

export const authError = (state: SecureReduxState) => s(state).error

export const currentUserSelector = (state: SecureReduxState) => s(state).user
