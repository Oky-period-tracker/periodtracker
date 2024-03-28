import { HelpCenterItem } from '../../types'
import { createAction } from '../helpers'

export function saveHelpCenter(helpCenterId: number | string) {
  return createAction('SAVE_HELP_CENTER', helpCenterId)
}

export function saveHelpCenterSuccess(helpCenter: HelpCenterItem) {
  return createAction('SAVE_HELP_CENTER_OK', helpCenter)
}

export function saveHelpCenterError(response: any) {
  return createAction('SAVE_HELP_CENTER_ERROR', JSON.stringify(response))
}
