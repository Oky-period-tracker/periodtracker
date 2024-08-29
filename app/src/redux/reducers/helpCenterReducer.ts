// import { HelpCenters } from "@oky/core";
import { Actions } from '../types'
import { HelpCenterActions } from '../actions'
// import { HelpCenters } from "../../types";

interface IHelpCenter {
  savedHelpCenterIds: number[]
}

const initialState = {
  savedHelpCenterIds: [],
}

export function helpCenterReducer(
  state = initialState,
  action: HelpCenterActions | Actions,
): IHelpCenter {
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

    case 'SET_SAVED_HELP_CENTERS':
      return {
        savedHelpCenterIds: [...action.payload],
      }

    default:
      return state
  }
}
