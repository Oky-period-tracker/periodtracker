import { ReduxState } from '../store'

const s = (state: ReduxState) => state.auth

export const appTokenSelector = (state: ReduxState) => s(state).appToken

export const authError = (state: ReduxState) => s(state).error

export const currentUserSelector = (state: ReduxState) => s(state).user
