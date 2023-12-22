import { SecureReduxState } from '../reducers'

const s = (state: SecureReduxState) => state.analytics

export const allAnalyticsEventsSelector = (state: SecureReduxState) => s(state)
