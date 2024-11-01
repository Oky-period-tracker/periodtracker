import { PredictionSerializableState } from '../../../prediction'

import { Actions } from '../../types/index'

export type PredictionState = PredictionSerializableState | null

const initialState: PredictionState = null

export function predictionReducer(state = initialState, action: Actions): PredictionState {
  switch (action.type) {
    case 'LOGOUT_CLEANUP': {
      return initialState
    }

    case 'MIGRATE_STORE': {
      if (action.payload.prediction) {
        return {
          ...state,
          ...action.payload.prediction,
        }
      }
      return state
    }

    case 'SYNC_STORES': {
      const onlineState = action.payload.onlinePrivateStore.prediction
      if (onlineState && !state) {
        return {
          ...onlineState,
        }
      }

      if (!onlineState && state) {
        return {
          ...state,
        }
      }

      if (!onlineState || !state) {
        return state
      }

      if (action.payload.isNewer) {
        return {
          ...state,
          ...action.payload.onlinePrivateStore.prediction,
        }
      }

      return {
        ...action.payload.onlinePrivateStore.prediction,
        ...state,
      }
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
