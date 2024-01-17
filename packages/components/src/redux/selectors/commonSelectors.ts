import { ReduxState } from '../reducers'

export const commonStateSelector = (state: ReduxState) => ({
  access: state.access,
})
