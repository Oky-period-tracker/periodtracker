import { useSelector as useReduxSelector, TypedUseSelectorHook } from 'react-redux'
import { CommonReduxState } from './reducers'

export const useCommonSelector: TypedUseSelectorHook<CommonReduxState> = useReduxSelector
