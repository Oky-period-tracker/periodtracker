import { useSelector as useReduxSelector, TypedUseSelectorHook } from 'react-redux'
import { ReduxState } from './reducers'

export const useSelector: TypedUseSelectorHook<ReduxState> = useReduxSelector
