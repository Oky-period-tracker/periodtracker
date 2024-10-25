import { ReduxState } from '../reducers'
import { LegacyVerifiedDates } from '../reducers/legacy/legacyAnswerReducer'

/*  
    Please note: 
    The structure of the store json in the database does not exactly match the structure of redux state, because of past, current and upcoming changes to redux state
*/

export interface PartialStateSnapshot {
  app?: ReduxState['app']
  prediction?: ReduxState['prediction']
  verifiedDates?: LegacyVerifiedDates // Not stored top level in redux
  // New per-user reducer data
  private?: ReduxState['private']
  // Optional
  helpCenters?: ReduxState['helpCenters']
}
