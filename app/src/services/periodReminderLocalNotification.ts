import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'
import moment, { Moment } from 'moment'
import { IS_ANDROID } from './device'
import {
  ReminderFrequency,
  calculateReminderDate,
  getRandomNotificationMessage,
} from './notificationScheduler'

const PERIOD_REMINDER_NOTIFICATION_ID_KEY = 'period_reminder_local_notification_id'
const PERIOD_REMINDER_CHANNEL_ID = 'period-reminder'
const PERIOD_REMINDER_HOUR = 8

interface SyncPeriodReminderNotificationParams {
  isEnabled: boolean
  reminderFrequency: ReminderFrequency
  predictedPeriodDate: Moment | Date | string | null
}

const ensureAndroidNotificationChannel = async () => {
  if (!IS_ANDROID) {
    return
  }

  await Notifications.setNotificationChannelAsync(PERIOD_REMINDER_CHANNEL_ID, {
    name: 'Period reminders',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  })
}

export const requestAppNotificationPermission = async () => {
  const existingPermissions = await Notifications.getPermissionsAsync()

  if (existingPermissions.granted) {
    return true
  }

  const requestedPermissions = await Notifications.requestPermissionsAsync()
  return requestedPermissions.granted
}

const buildReminderDateAtMorning = (
  predictedPeriodDate: Moment | Date | string,
  reminderFrequency: ReminderFrequency,
) => {
  const reminderDate = calculateReminderDate(predictedPeriodDate, reminderFrequency)
    .hour(PERIOD_REMINDER_HOUR)
    .minute(0)
    .second(0)
    .millisecond(0)

  return reminderDate
}

const persistScheduledNotificationId = async (notificationId: string | null) => {
  if (!notificationId) {
    await AsyncStorage.removeItem(PERIOD_REMINDER_NOTIFICATION_ID_KEY)
    return
  }

  await AsyncStorage.setItem(PERIOD_REMINDER_NOTIFICATION_ID_KEY, notificationId)
}

const getPersistedScheduledNotificationId = async () => {
  return AsyncStorage.getItem(PERIOD_REMINDER_NOTIFICATION_ID_KEY)
}

export const cancelScheduledPeriodReminderNotification = async () => {
  const existingNotificationId = await getPersistedScheduledNotificationId()

  if (existingNotificationId) {
    try {
      await Notifications.cancelScheduledNotificationAsync(existingNotificationId)
    } catch (error) {
      // Ignore stale IDs; clear local state either way.
    }
  }

  await persistScheduledNotificationId(null)
}

const schedulePeriodReminderNotification = async (
  predictedPeriodDate: Moment | Date | string,
  reminderFrequency: Exclude<ReminderFrequency, null>,
) => {
  const hasPermission = await requestAppNotificationPermission()

  if (!hasPermission) {
    return null
  }

  await ensureAndroidNotificationChannel()

  const reminderDate = buildReminderDateAtMorning(predictedPeriodDate, reminderFrequency)

  if (reminderDate.isSameOrBefore(moment())) {
    return null
  }

  const trigger: Notifications.NotificationTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DATE,
    date: reminderDate.valueOf(),
  }

  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Oky',
      body: getRandomNotificationMessage(),
      data: {
        type: 'period_reminder_outer',
      },
    },
    trigger,
  })

  return notificationId
}

export const syncPeriodReminderLocalNotification = async ({
  isEnabled,
  reminderFrequency,
  predictedPeriodDate,
}: SyncPeriodReminderNotificationParams) => {
  await cancelScheduledPeriodReminderNotification()

  if (!isEnabled || !reminderFrequency || !predictedPeriodDate) {
    return
  }

  const notificationId = await schedulePeriodReminderNotification(
    predictedPeriodDate,
    reminderFrequency,
  )

  await persistScheduledNotificationId(notificationId)
}
