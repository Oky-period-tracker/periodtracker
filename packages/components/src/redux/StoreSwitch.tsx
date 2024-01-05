import React from 'react'
import { SimpleSplashScreen } from '../screens/SplashScreen'
import { navigateAndReset } from '../services/navigationService'
import { useStoreCoordinator } from './StoreCoordinator'

export function StoreSwitch() {
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
