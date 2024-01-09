import React from 'react'
import { useStoreCoordinator } from './StoreCoordinator'
import { SimpleSplashScreen } from '../screens/SplashScreen'
import { navigateAndReset } from '../services/navigationService'

type StoreSwitchAction = 'login' | 'logout' | 'delete'

type ActionMap = Record<StoreSwitchAction, () => void>

type DestinationMap = Record<StoreSwitchAction, string>

const destinations: DestinationMap = {
  login: 'MainStack',
  logout: 'LoginStack',
  delete: 'LoginStack',
}

export const StoreSwitchSplash = ({ navigation }) => {
  const action = navigation.getParam('action') as StoreSwitchAction
  const { switchStore, switchComplete, logout, logoutComplete, deleteStore } = useStoreCoordinator()

  const actions: ActionMap = {
    login: switchStore,
    logout,
    delete: deleteStore,
  }

  React.useEffect(() => {
    if (!action) {
      return
    }

    actions[action]()
  }, [action])

  React.useEffect(() => {
    if (!action) {
      return
    }

    if (action === 'login' && !switchComplete) {
      return
    }

    if (action === 'logout' && (!logoutComplete || switchComplete)) {
      return
    }

    if (action === 'delete' && (!logoutComplete || switchComplete)) {
      return
    }

    navigateAndReset(destinations[action], null)
  }, [switchComplete, logoutComplete])

  return <SimpleSplashScreen />
}

export const navigateToStoreSwitch = (action: StoreSwitchAction) => {
  return navigateAndReset('StoreSwitchStack', { action })
}
