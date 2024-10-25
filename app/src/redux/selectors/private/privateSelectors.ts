import { ReduxState } from '../../reducers'

const s = (state: ReduxState) => state.private

export const privateStoreSelector = (state: ReduxState) => s(state)

export const lastModifiedSelector = (state: ReduxState) => s(state).lastModified
