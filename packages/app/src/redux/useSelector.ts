import {
  useSelector as useReduxSelector,
  TypedUseSelectorHook,
} from 'react-redux'
import { ReduxState } from '../redux/store'

export const useSelector: TypedUseSelectorHook<ReduxState> = useReduxSelector
