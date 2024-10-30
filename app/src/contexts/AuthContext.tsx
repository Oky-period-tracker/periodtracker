import React from 'react'
import { useLoading } from './LoadingProvider'
import { useDispatch } from 'react-redux'
import { useSelector } from '../redux/useSelector'
import { currentUserSelector } from '../redux/selectors'
import { setLastLoggedInUsername } from '../redux/actions'

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
  const user = useSelector(currentUserSelector)
  const [isLoggedIn, setIsLoggedInState] = React.useState(false)
  const { setLoading } = useLoading()

  const setIsLoggedIn = (value: boolean) => {
    setLoading(true)
    setIsLoggedInState(value)
  }

  const dispatch = useDispatch()

  React.useEffect(() => {
    if (!isLoggedIn || !user?.name) {
      return
    }

    dispatch(setLastLoggedInUsername(user?.name))
  }, [isLoggedIn, user?.name])

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
