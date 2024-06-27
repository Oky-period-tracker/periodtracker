import { VerifiedDates } from '../reducers/answerReducer'
import { ReduxState } from '../store'

/*  
    Please note: 
    The structure of the store json in the database does not exactly match the structure of redux state, because of past, current and upcoming changes to redux state
*/

export interface PartialStateSnapshot {
  app?: ReduxState['app']
  prediction?: ReduxState['prediction']
  verifiedDates?: VerifiedDates // Not stored top level in redux
  // Optional
  helpCenters?: ReduxState['helpCenters']
}
