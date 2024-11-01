import { Actions } from '../../types'
import { HelpCenterActions } from '../../actions'

export interface HelpCenterState {
  savedHelpCenterIds: number[]
}

const initialState: HelpCenterState = {
  savedHelpCenterIds: [],
}

export function helpCenterReducer(
  state = initialState,
  action: HelpCenterActions | Actions,
): HelpCenterState {
  switch (action.type) {
    case 'LOGOUT_CLEANUP': {
      return initialState
    }

    case 'MIGRATE_STORE':
      return {
        ...state,
        ...action.payload.helpCenters,
      }

    case 'SYNC_STORES': {
      if (action.payload.isNewer) {
        return {
          ...state,
          ...action.payload.onlinePrivateStore.helpCenters,
        }
      }

      return {
        ...action.payload.onlinePrivateStore.helpCenters,
        ...state,
      }
    }

    case 'SET_SAVED_HELP_CENTERS':
      return {
        savedHelpCenterIds: [...action.payload],
      }

    default:
      return state
  }
}
