import { ReduxState } from '../reducers'

// Stable empty reference to avoid creating new arrays on every call
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EMPTY_ARRAY: any[] = []

const s = (state: ReduxState) => state.helpCenters

export const savedHelpCenterIdsSelector = (state: ReduxState) =>
  s(state).savedHelpCenterIds ?? EMPTY_ARRAY
