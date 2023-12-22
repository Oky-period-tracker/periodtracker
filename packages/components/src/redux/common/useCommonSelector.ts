import { useSelector as useReduxSelector, TypedUseSelectorHook } from 'react-redux'
import { ReduxState } from './reducers'

export const useCommonSelector: TypedUseSelectorHook<ReduxState> = useReduxSelector
