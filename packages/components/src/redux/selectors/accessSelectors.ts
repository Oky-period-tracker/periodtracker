import { ReduxState } from '../reducers'

const s = (state: ReduxState) => state.access

export const storeCredentialsSelector = (state: ReduxState) => s(state).storeCredentials

export const lastLoggedInUsernameSelector = (state: ReduxState) => s(state).lastLoggedInUsername
