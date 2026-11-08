import { useSelector } from '../redux/useSelector'
import { currentUserSelector } from '../redux/selectors'
import { getActiveBundle } from '../redux/storeManager'
import { usePredictionEngineState } from '../contexts/PredictionProvider'
import { ANON_USER_ID } from '../services/storage/storageKeys'
import {
  REMINDER_CYCLES_AHEAD,
  ReminderFrequency,
  getUpcomingReminderDates,
} from '../services/notificationScheduler'
import {
  dismissPeriodReminders,
  syncPeriodReminders,
} from '../services/periodReminderLocalNotification'
import { useTranslate } from './useTranslate'

// Bring the active account's reminders up to date: reschedule them from its latest prediction,
// in its current language and with its name, and clear any it already has in the tray.
// Accounts are keyed by their local registry id (the one the login screen lists), not the
// server id, which may differ.
export const usePeriodReminderSync = () => {
  const translate = useTranslate()
  const currentUser = useSelector(currentUserSelector)
  const prediction = usePredictionEngineState()

  return async (frequency: ReminderFrequency | null) => {
    const userId = getActiveBundle()?.userId
    if (!userId || userId === ANON_USER_ID) {
      return
    }

    const reminderDates = frequency
      ? getUpcomingReminderDates(prediction, frequency, REMINDER_CYCLES_AHEAD)
      : []

    await syncPeriodReminders(userId, reminderDates, {
      title: translate('period_reminder_notification_title'),
      body: translate('period_reminder_notification_body').replace(
        '{name}',
        currentUser?.name ?? '',
      ),
      channelName: translate('period_reminder_channel_name'),
    })
    await dismissPeriodReminders(userId)
  }
}
