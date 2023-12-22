import { useSelector as useReduxSelector, TypedUseSelectorHook } from 'react-redux'
import { SecureReduxState } from './reducers'

export const useSecureSelector: TypedUseSelectorHook<SecureReduxState> = useReduxSelector
