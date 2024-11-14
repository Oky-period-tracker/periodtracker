import _ from 'lodash'
import { Actions } from '../../types/index'
import { RehydrateAction } from 'redux-persist'

export interface User {
  id: string
  name: string
  dateOfBirth: string
  gender: string
  location: string
  country: string
  province: string
  password: string
  secretQuestion: string
  secretAnswer: string
  dateSignedUp: string
  isGuest: boolean
  metadata: UserMetadata
}

export interface UserMetadata {
  // PH
  genderIdentity?: string
  accommodationRequirement?: string
  religion?: string
  contentSelection?: number
  city?: string
  isProfileUpdateSkipped?: boolean
}

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

    case 'MIGRATE_STORE':
      return {
        ...state,
        ...action.payload.user,
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

    case 'SET_APP_TOKEN':
      return {
        ...state,
        //@ts-expect-error TODO:
        user: {
          ...state.user,
          isGuest: false,
        },
        appToken: action.payload,
      }

    default:
      return state
  }
}
