import { HelpCenters } from '@oky/core'
import { Actions } from '../types'
import { HelpCenterActions } from '../actions'

interface IHelpCenter {
  savedHelpCenters: HelpCenters
}

const initialState = {
  savedHelpCenters: [],
}

export function helpCenterReducer(
  state = initialState,
  action: HelpCenterActions | Actions,
): IHelpCenter {
  switch (action.type) {
    case 'REFRESH_STORE': {
      if (!action?.payload?.helpCenters) {
        return state
      }
      return {
        ...state,
        ...action.payload.helpCenters,
      }
    }
    case 'SAVE_HELP_CENTER':
      return {
        savedHelpCenters: [...state.savedHelpCenters, action.payload],
      }
    case 'UNSAVE_HELP_CENTER':
      return {
        savedHelpCenters: [...action.payload],
      }
    case 'SAVE_HELP_CENTER_OK':
    case 'SAVE_HELP_CENTER_ERROR':
      return state
    default:
      return state
  }
}
