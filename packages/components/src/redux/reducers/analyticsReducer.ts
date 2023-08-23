import { Actions } from '../types'

export type AnalyticsState = Array<{
  id: string
  type: string
  payload: any
  metadata: any
}>

const initialState: AnalyticsState = []

export function analyticsReducer(
  state = initialState,
  action: Actions,
): AnalyticsState {
  switch (action.type) {
    case 'QUEUE_EVENT':
      return state.concat({
        id: action.payload.id,
        type: action.payload.type,
        payload: action.payload.payload,
        metadata: action.payload.metadata,
      })

    case 'RESET_QUEUE':
      return initialState

    default:
      return state
  }
}
