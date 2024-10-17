// import { HelpCenters } from "@oky/core";
import { Actions } from '../types'
import { HelpCenterActions } from '../actions'
// import { HelpCenters } from "../../types";

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
    case 'REFRESH_STORE': {
      if (!action?.payload?.helpCenters) {
        return {
          ...initialState,
          ...state,
        }
      }
      return {
        ...initialState,
        ...state,
        ...action.payload.helpCenters,
      }
    }

    case 'LOGOUT_CLEANUP': {
      return initialState
    }

    case 'SET_SAVED_HELP_CENTERS':
      return {
        savedHelpCenterIds: [...action.payload],
      }

    default:
      return state
  }
}
