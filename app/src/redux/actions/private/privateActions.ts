import { createAction } from '../../helpers'
import { PrivateState } from '../../reducers/private/privateReducer'

export function syncPrivateStores(payload: { oldStore: PrivateState; newStore: PrivateState }) {
  return createAction('SYNC_STORES', payload)
}
