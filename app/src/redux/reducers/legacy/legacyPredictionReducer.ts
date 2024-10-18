import { PredictionSerializableState } from '../../../prediction'

export type LegacyPredictionState = PredictionSerializableState | null

const initialState: LegacyPredictionState = null

export function legacyPredictionReducer(state = initialState): LegacyPredictionState {
  return state
}
