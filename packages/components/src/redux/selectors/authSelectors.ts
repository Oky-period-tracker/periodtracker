import { CommonReduxState } from '../reducers'

const s = (state: CommonReduxState) => state.auth

export const appTokenSelector = (state: CommonReduxState) => s(state).appToken

export const authError = (state: CommonReduxState) => s(state).error

export const currentUserSelector = (state: CommonReduxState) => s(state).user
