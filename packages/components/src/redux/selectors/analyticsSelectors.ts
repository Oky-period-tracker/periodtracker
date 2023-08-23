import { ReduxState } from '../store'

const s = (state: ReduxState) => state.analytics

export const allAnalyticsEventsSelector = (state: ReduxState) => s(state)
