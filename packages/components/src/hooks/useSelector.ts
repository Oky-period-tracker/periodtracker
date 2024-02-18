import { useSelector as useReduxSelector, TypedUseSelectorHook } from 'react-redux'
import { ReduxState } from '../redux/reducers'

export const useSelector: TypedUseSelectorHook<ReduxState> = useReduxSelector
