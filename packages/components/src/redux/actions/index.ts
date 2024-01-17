import { createAction } from '../helpers'

export * from './accessActions'
export * from './analyticsActions'
export * from './answerActions'
export * from './appActions'
export * from './authActions'
export * from './commonActions'
export * from './contentActions'
export * from './predictionActions'

export function migrateStore(
  payload: any, // ReduxState
) {
  return createAction('MIGRATE_STORE', payload)
}
