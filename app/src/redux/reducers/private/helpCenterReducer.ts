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

    case 'SYNC_STORES': {
      return {
        ...state,
        ...(action.payload.oldStore.helpCenters ?? initialState),
        ...(action.payload.newStore.helpCenters ?? initialState),
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
