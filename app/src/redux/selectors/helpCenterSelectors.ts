import { ReduxState } from '../reducers'

const s = (state: ReduxState) => state.helpCenters

export const savedHelpCenterIdsSelector = (state: ReduxState) => s(state).savedHelpCenterIds ?? []
