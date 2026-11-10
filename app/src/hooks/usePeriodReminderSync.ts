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
  PeriodReminderContent,
  dismissPeriodReminders,
  scheduleTestPeriodReminder,
  syncPeriodReminders,
} from '../services/periodReminderLocalNotification'
import { useTranslate } from './useTranslate'

// Accounts are keyed by their local registry id (the one the login screen lists), not the
// server id, which may differ. The logged-out (anon) context has no reminders.
const getReminderUserId = () => {
  const userId = getActiveBundle()?.userId
  return userId && userId !== ANON_USER_ID ? userId : null
}

// The reminder as the active account sees it: in its current language and with its name.
const usePeriodReminderContent = () => {
  const translate = useTranslate()
  const currentUser = useSelector(currentUserSelector)

  return (): PeriodReminderContent => ({
    title: translate('period_reminder_notification_title'),
    body: translate('period_reminder_notification_body').replace('{name}', currentUser?.name ?? ''),
    channelName: translate('period_reminder_channel_name'),
  })
}

// Bring the active account's reminders up to date: reschedule them from its latest prediction,
// in its current language and with its name, and clear any it already has in the tray.
export const usePeriodReminderSync = () => {
  const getContent = usePeriodReminderContent()
  const prediction = usePredictionEngineState()

  return async (frequency: ReminderFrequency | null) => {
    const userId = getReminderUserId()
    if (!userId) {
      return
    }

    const reminderDates = frequency
      ? getUpcomingReminderDates(prediction, frequency, REMINDER_CYCLES_AHEAD)
      : []

    await syncPeriodReminders(userId, reminderDates, getContent())
    await dismissPeriodReminders(userId)
  }
}

// Debugging aid: fire the active account's real reminder in a few seconds. Resolves to false when
// there is no account or no notification permission.
export const useTestPeriodReminder = () => {
  const getContent = usePeriodReminderContent()

  return async (delaySeconds: number) => {
    const userId = getReminderUserId()
    if (!userId) {
      return false
    }
    return scheduleTestPeriodReminder(userId, getContent(), delaySeconds)
  }
}
