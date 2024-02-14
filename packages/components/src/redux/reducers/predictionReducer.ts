import _ from 'lodash'
import moment from 'moment'
import { PredictionSerializableState } from '../../prediction'

import { Actions } from '../types/index'

export type PredictionState = PredictionSerializableState | null

const initialState: PredictionState = null

export function predictionReducer(state = initialState, action: Actions): PredictionState {
  switch (action.type) {
    case 'REFRESH_STORE': {
      if (!action?.payload?.prediction) {
        return state
      }
      return {
        ...state,
        ...action.payload.prediction,
      }
    }

    case 'SET_PREDICTION_ENGINE_STATE':
      return action.payload.predictionState.toJSON()

    case 'SMART_PREDICTION_FAILURE':
      return {
        ...state,
      }
    case 'SET_FUTURE_PREDICTION_STATE_ACTIVE':
      return {
        ...state,
        futurePredictionStatus: action.payload.isFuturePredictionActive,
        actualCurrentStartDate: !action.payload.isFuturePredictionActive
          ? action.payload.currentStartDate
          : null,
      }

    case 'SET_ACTUAL_STARTDATE':
      return {
        ...state,
        actualCurrentStartDate: null,
      }
    default:
      return state
  }
}
