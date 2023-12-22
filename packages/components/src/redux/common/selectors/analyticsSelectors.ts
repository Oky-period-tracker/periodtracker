import { CommonReduxState } from '../reducers'

const s = (state: CommonReduxState) => state.analytics

export const allAnalyticsEventsSelector = (state: CommonReduxState) => s(state)
