import React from 'react'
import { SimpleSplashScreen } from '../screens/SplashScreen'
import { navigateAndReset } from '../services/navigationService'
import { useStoreCoordinator } from './StoreCoordinator'

export function StoreSwitchSplash() {
  const { switchStore, switchComplete } = useStoreCoordinator()

  React.useEffect(() => {
    switchStore()
  }, [])

  React.useEffect(() => {
    if (switchComplete) {
      navigateAndReset('MainStack', null)
    }
  }, [switchComplete])

  return <SimpleSplashScreen />
}

export function LogoutSplash() {
  const { switchComplete, logout, loggedOut } = useStoreCoordinator()

  React.useEffect(() => {
    logout()
  }, [])

  React.useEffect(() => {
    if (!loggedOut || switchComplete) {
      return
    }
    navigateAndReset('LoginStack', null)
  }, [loggedOut])

  return <SimpleSplashScreen />
}

export function DeleteAccountSplash() {
  const { switchComplete, deleteStore, loggedOut } = useStoreCoordinator()

  React.useEffect(() => {
    deleteStore()
  }, [])

  React.useEffect(() => {
    if (!loggedOut || switchComplete) {
      return
    }
    navigateAndReset('LoginStack', null)
  }, [loggedOut])

  return <SimpleSplashScreen />
}
