import { ReduxState } from '../reducers'
import { calculateCycles } from '../../services/cycleCalculations'

const s = (state: ReduxState) => state.auth

export const appTokenSelector = (state: ReduxState) => s(state).appToken

export const authError = (state: ReduxState) => s(state).error

export const currentUserSelector = (state: ReduxState) => s(state).user

export const connectAccountAttemptsSelector = (state: ReduxState) => s(state).connectAccountAttempts

export const cyclesNumberSelector = (state: ReduxState) =>
  calculateCycles(s(state).user?.metadata).cyclesNumber
