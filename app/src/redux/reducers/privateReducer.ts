import { Actions } from '../types'
import { RehydrateAction, REHYDRATE } from 'redux-persist'

export type PrivateState = {
  name: string
} | null

export function privateReducer(
  state: PrivateState = null,
  action: Actions | RehydrateAction,
): PrivateState {
  switch (action.type) {
    case REHYDRATE: {
      // @ts-expect-error payload type object
      if (action.payload && action.payload.private) {
        return {
          // @ts-expect-error payload type object
          ...action.payload.private,
        }
      } else {
        return state
      }
    }

    case 'EDIT_USER_NAME': {
      return {
        name: action.payload,
      }
    }

    case 'LOGOUT_CLEANUP': {
      return null
    }

    default:
      return state
  }
}
