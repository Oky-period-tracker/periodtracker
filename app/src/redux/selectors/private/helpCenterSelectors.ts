import { ReduxState } from '../../reducers'

const s = (state: ReduxState) => state.private.helpCenters

export const savedHelpCenterIdsSelector = (state: ReduxState) => s(state).savedHelpCenterIds ?? []
