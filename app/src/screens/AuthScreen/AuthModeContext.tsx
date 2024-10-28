import React from 'react'
import { useSelector } from '../../redux/useSelector'
import { hasOpenedSelector, lastLoggedInUsernameSelector } from '../../redux/selectors'

export type AuthMode =
  | 'welcome'
  | 'start'
  | 'sign_up'
  | 'avatar_and_theme'
  | 'onboard_journey'
  | 'log_in'
  | 'forgot_password'
  | 'delete_account'

export type AuthModeContext = {
  authMode: AuthMode
  setAuthMode: React.Dispatch<React.SetStateAction<AuthMode>>
}

const defaultValue: AuthModeContext = {
  authMode: 'start',
  setAuthMode: () => {
    //
  },
}

const AuthContext = React.createContext<AuthModeContext>(defaultValue)

export const AuthModeProvider = ({ children }: React.PropsWithChildren) => {
  const lastLoggedInUsername = useSelector(lastLoggedInUsernameSelector)
  const hasOpened = useSelector(hasOpenedSelector)

  const initialState = !hasOpened ? 'welcome' : lastLoggedInUsername ? 'log_in' : 'start'
  const [authMode, setAuthMode] = React.useState<AuthMode>(initialState)

  return <AuthContext.Provider value={{ authMode, setAuthMode }}>{children}</AuthContext.Provider>
}

export const useAuthMode = () => {
  return React.useContext(AuthContext)
}
