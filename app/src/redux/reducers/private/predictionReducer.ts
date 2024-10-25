import { PredictionSerializableState } from '../../../prediction'

import { Actions } from '../../types/index'

export type PredictionState = PredictionSerializableState | null

const initialState: PredictionState = null

export function predictionReducer(state = initialState, action: Actions): PredictionState {
  switch (action.type) {
    case 'SYNC_STORES': {
      // @ts-expect-error TODO:
      return {
        ...(state ?? {}),
        ...(action.payload.oldStore.prediction ?? {}),
        ...(action.payload.newStore.prediction ?? {}),
      }
    }

    case 'LOGOUT_CLEANUP': {
      return initialState
    }

    case 'SET_PREDICTION_ENGINE_STATE':
      return action.payload.predictionState.toJSON()

    case 'SMART_PREDICTION_FAILURE':
      // @ts-expect-error TODO:
      return {
        ...state,
      }

    case 'USER_SET_FUTURE_PREDICTION_STATE_ACTIVE':
    case 'SET_FUTURE_PREDICTION_STATE_ACTIVE':
      // @ts-expect-error TODO:
      return {
        ...state,
        futurePredictionStatus: action.payload.isFuturePredictionActive,
        actualCurrentStartDate: !action.payload.isFuturePredictionActive
          ? action.payload.currentStartDate
          : null,
      }

    case 'SET_ACTUAL_STARTDATE':
      // @ts-expect-error TODO:
      return {
        ...state,
        actualCurrentStartDate: null,
      }
    default:
      return state
  }
}
