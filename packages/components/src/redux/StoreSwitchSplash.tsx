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
  const { switchStore, switchComplete, logout, loggedOut, deleteStore } = useStoreCoordinator()

  const actions: ActionMap = {
    login: switchStore,
    logout,
    delete: deleteStore,
  }

  React.useEffect(() => {
    actions[action]()
  }, [action])

  React.useEffect(() => {
    if (action === 'login' && !switchComplete) {
      return
    }

    if (action === 'logout' && (!loggedOut || switchComplete)) {
      return
    }

    if (action === 'delete' && (!loggedOut || switchComplete)) {
      return
    }

    navigateAndReset(destinations[action], null)
  }, [switchComplete, loggedOut])

  return <SimpleSplashScreen />
}

export const navigateToStoreSwitch = (action: StoreSwitchAction) => {
  return navigateAndReset('StoreSwitchStack', { action })
}
