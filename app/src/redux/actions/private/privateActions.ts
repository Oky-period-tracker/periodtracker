import { createAction } from '../../helpers'
import { PrivateState } from '../../reducers/private/privateReducer'

export function syncPrivateStoresRequest(payload: PrivateState) {
  return createAction('SYNC_STORES_REQUEST', payload)
}

export function syncPrivateStores(payload: { onlinePrivateStore: PrivateState; isNewer: boolean }) {
  return createAction('SYNC_STORES', payload)
}

export function migratePrivateStore(payload: PrivateState) {
  return createAction('MIGRATE_STORE', payload)
}
