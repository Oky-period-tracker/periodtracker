import React from 'react'
import { AppState } from 'react-native'
import {
  getUsersWithPeriodReminders,
  subscribeToNotificationTaps,
} from '../services/periodReminderLocalNotification'

// Local ids of the accounts with a period reminder waiting for them. Refreshed whenever the app
// returns to the foreground or a notification is tapped, since the auth screen can stay mounted.
export const useUsersWithPeriodReminders = () => {
  const [userIds, setUserIds] = React.useState<Set<string>>(() => new Set())

  React.useEffect(() => {
    let mounted = true
    const refresh = () => {
      getUsersWithPeriodReminders()
        .then((ids) => {
          if (mounted) {
            setUserIds(ids)
          }
        })
        .catch(() => {
          // notifications unavailable: show no dots
        })
    }

    refresh()
    const appStateSubscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        refresh()
      }
    })
    const unsubscribeTaps = subscribeToNotificationTaps(refresh)

    return () => {
      mounted = false
      appStateSubscription.remove()
      unsubscribeTaps()
    }
  }, [])

  return userIds
}
