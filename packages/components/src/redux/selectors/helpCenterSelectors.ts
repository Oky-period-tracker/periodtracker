import { ReduxState } from '../store'

const s = (state: ReduxState) => state.helpCenters

export const savedHelpCentersSelector = (state: ReduxState) => s(state).savedHelpCenters
