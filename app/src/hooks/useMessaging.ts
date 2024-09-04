import React from 'react'
import { PermissionsAndroid } from 'react-native'
import { useSelector } from '../redux/useSelector'
import { currentLocaleSelector } from '../redux/selectors'
import { IS_ANDROID } from '../services/device'
import { messaging } from '../services/firebase'

export const useMessaging = () => {
  const locale = useSelector(currentLocaleSelector)

  React.useEffect(() => {
    const topicName = `oky_${locale}_notifications`

    const handleMessaging = async () => {
      const hasPermission = await requestPermission()

      if (!hasPermission) {
        return
      }

      messaging?.().subscribeToTopic(topicName)
    }

    handleMessaging()

    return () => {
      messaging?.().unsubscribeFromTopic(topicName)
    }
  }, [locale])
}

const requestPermission = async () => {
  if (!messaging) {
    return false
  }

  if (IS_ANDROID) {
    const alreadyGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    )

    if (alreadyGranted) {
      return true
    }

    const androidStatus = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    )

    return androidStatus === 'granted'
  }

  /* 
    NOT_DETERMINED: -1
    DENIED: 0
    AUTHORIZED: 1
    PROVISIONAL: 2
    EPHEMERAL: 3
  */
  const status = await messaging().hasPermission()

  // AUTHORIZED
  if (status === 1) {
    return true
  }

  const authStatus = await messaging().requestPermission()
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL

  return enabled
}
