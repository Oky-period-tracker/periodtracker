import _ from 'lodash'
import { Actions } from '../../types/index'
import { RehydrateAction } from 'redux-persist'
import { User } from '../../../types'

export interface UserState {
  appToken: string | null
  user: User | null
}

const initialState: UserState = {
  appToken: null,
  user: null,
}

export function userReducer(state = initialState, action: Actions | RehydrateAction): UserState {
  switch (action.type) {
    case 'LOGOUT_CLEANUP': {
      return initialState
    }

    case 'INIT_USER':
      return {
        user: action.payload.user,
        appToken: action.payload.appToken,
      }

    case 'EDIT_USER':
      return {
        ...state,
        // @ts-expect-error TODO:
        user: { ...state.user, ..._.omitBy(action.payload, _.isNil) },
      }

    default:
      return state
  }
}
