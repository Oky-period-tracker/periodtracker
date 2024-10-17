import { Actions } from '../types'
import { RehydrateAction, REHYDRATE } from 'redux-persist'

export type UserState = {
  name: string
} | null

export function userReducer(state: UserState = null, action: Actions | RehydrateAction): UserState {
  switch (action.type) {
    case REHYDRATE: {
      // @ts-expect-error payload type object
      if (action.payload && action.payload.user) {
        return {
          // @ts-expect-error payload type object
          ...action.payload.user,
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
