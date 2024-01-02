import React from 'react'
import { SimpleSplashScreen } from '../screens/SplashScreen'
import { navigateAndReset } from '../services/navigationService'
import { useStoreCoordinator } from './StoreCoordinator'

export function StoreSwitch() {
  const { triggerStoreSwitch, switchComplete } = useStoreCoordinator()

  React.useEffect(() => {
    triggerStoreSwitch()
  }, [])

  React.useEffect(() => {
    if (switchComplete) {
      navigateAndReset('MainStack', null)
    }
  }, [switchComplete])

  return <SimpleSplashScreen />
}
