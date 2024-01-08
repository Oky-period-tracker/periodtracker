import { createAction } from '../helpers'
import { ReduxState } from '../reducers'

export * from './accessActions'
export * from './analyticsActions'
export * from './answerActions'
export * from './appActions'
export * from './authActions'
export * from './contentActions'
export * from './predictionActions'

export function migrateStore(payload: { auth: ReduxState['auth'] }) {
  return createAction('MIGRATE_STORE', payload)
}
