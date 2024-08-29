import React from 'react'
import { useLoading } from './LoadingProvider'

export type AuthContext = {
  isLoggedIn: boolean
  setIsLoggedIn: (value: boolean) => void
}

const defaultValue: AuthContext = {
  isLoggedIn: false,
  setIsLoggedIn: () => {},
}

const AuthContext = React.createContext<AuthContext>(defaultValue)

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [isLoggedIn, setIsLoggedInState] = React.useState(false)
  const { setLoading } = useLoading()

  const setIsLoggedIn = (value: boolean) => {
    setLoading(true)
    setIsLoggedInState(value)
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return React.useContext(AuthContext)
}
