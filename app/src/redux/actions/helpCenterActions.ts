import { createAction } from '../helpers'
import { ActionsUnion } from '../types/types'

export function setSavedHelpCenters(helpCenterIds: number[]) {
  return createAction('SET_SAVED_HELP_CENTERS', helpCenterIds)
}

const helpCenterActions = {
  setSavedHelpCenters,
}

export type HelpCenterActions = ActionsUnion<typeof helpCenterActions>
