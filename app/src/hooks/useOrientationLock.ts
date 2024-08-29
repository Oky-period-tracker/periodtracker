import React from 'react'
import { IS_TABLET, IS_WEB } from '../services/device'
import { OrientationLock, lockAsync, unlockAsync } from 'expo-screen-orientation'

export const useOrientationLock = () => {
  React.useEffect(() => {
    if (IS_TABLET || IS_WEB) {
      return
    }

    lockAsync(OrientationLock.PORTRAIT_UP)

    return () => {
      unlockAsync()
    }
  }, [])
}
