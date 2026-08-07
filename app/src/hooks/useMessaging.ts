import React from 'react'
import { useSelector } from '../redux/useSelector'
import { currentLocaleSelector } from '../redux/selectors'
import { messaging } from '../services/firebase'
import { requestAppNotificationPermission } from '../services/periodReminderLocalNotification'

export const useMessaging = () => {
  const locale = useSelector(currentLocaleSelector)

  React.useEffect(() => {
    const topicName = `oky_${locale}_notifications`

    const handleMessaging = async () => {
      const hasPermission = await requestPermission()

      if (!hasPermission) {
        return
      }

      if (!messaging) {
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

export const requestPermission = requestAppNotificationPermission
