import { createAction } from '../helpers'
import { ReduxState } from '../reducers'

export function setCommonState(payload: {
  access: ReduxState['access'] //
}) {
  return createAction('SET_COMMON_STATE', payload)
}
