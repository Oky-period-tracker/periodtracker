import { ReduxState } from '../../reducers'

const s = (state: ReduxState) => state.private.user

export const appTokenSelector = (state: ReduxState) => s(state).appToken

export const currentUserSelector = (state: ReduxState) => s(state).user
