export interface LegacyHelpCenterState {
  savedHelpCenterIds: number[]
}

const initialState: LegacyHelpCenterState = {
  savedHelpCenterIds: [],
}

export function legacyHelpCenterReducer(state = initialState): LegacyHelpCenterState {
  return state
}
