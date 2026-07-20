import React from 'react'
import { useSelector } from '../../redux/useSelector'
import {
  currentUserSelector,
  hasOpenedSelector,
  onboardingPendingSelector,
} from '../../redux/selectors'
import { listUsers } from '../../services/userMetadata/registry'

export type AuthMode =
  | 'welcome'
  | 'start'
  | 'sign_up'
  | 'avatar_selection'
  | 'theme_selection'
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
  const user = useSelector(currentUserSelector)
  const hasOpened = useSelector(hasOpenedSelector)
  // Set on the just-created account's store by signupAccount; routes straight into onboarding.
  const onboardingPending = useSelector(onboardingPendingSelector)

  // hasOpened lives in the per-user (and anon) redux store, so after a logout the fresh anon
  // store would replay the one-time welcome intro. Gate the intro on the device having no
  // accounts yet, so it only ever shows on a genuinely fresh device.
  const [hasAccounts, setHasAccounts] = React.useState<boolean | null>(null)
  React.useEffect(() => {
    let mounted = true
    listUsers()
      .then((accounts) => {
        if (mounted) {
          setHasAccounts(accounts.length > 0)
        }
      })
      .catch(() => {
        if (mounted) {
          setHasAccounts(false)
        }
      })
    return () => {
      mounted = false
    }
  }, [])

  // Wait for the account check before deciding the initial mode, so the welcome intro never
  // flashes on a device that already has accounts.
  if (hasAccounts === null) {
    return null
  }

  return (
    <AuthModeInner
      onboardingPending={!!onboardingPending}
      showWelcome={!hasOpened && !hasAccounts}
      hasUser={!!user}
    >
      {children}
    </AuthModeInner>
  )
}

const AuthModeInner = ({
  onboardingPending,
  showWelcome,
  hasUser,
  children,
}: React.PropsWithChildren<{
  onboardingPending: boolean
  showWelcome: boolean
  hasUser: boolean
}>) => {
  const initialState: AuthMode = onboardingPending
    ? 'avatar_selection'
    : showWelcome
    ? 'welcome'
    : hasUser
    ? 'log_in'
    : 'start'
  const [authMode, setAuthMode] = React.useState<AuthMode>(initialState)

  return <AuthContext.Provider value={{ authMode, setAuthMode }}>{children}</AuthContext.Provider>
}

export const useAuthMode = () => {
  return React.useContext(AuthContext)
}
