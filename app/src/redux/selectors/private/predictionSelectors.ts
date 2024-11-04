import { ReduxState } from '../../reducers'

const s = (state: ReduxState) => state.private.prediction

export const isFuturePredictionSelector = (state: ReduxState) => s(state)

export const isFuturePredictionActiveSelector = (state: ReduxState) =>
  s(state)?.futurePredictionStatus
