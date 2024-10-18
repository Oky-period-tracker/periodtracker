import { ReduxState } from '../reducers'

const s = (state: ReduxState) => state.auth

export const authError = (state: ReduxState) => s(state).error

export const connectAccountAttemptsSelector = (state: ReduxState) => s(state).connectAccountAttempts
