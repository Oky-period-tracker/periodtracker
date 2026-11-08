import * as Notifications from 'expo-notifications'
import { Moment } from 'moment'
import { IS_ANDROID } from './device'

const PERIOD_REMINDER_CHANNEL_ID = 'period-reminder'
// Identifiers look like `period-reminder:<userId>:<n>`, so every account on the device owns its
// own reminders and one account's sync never cancels another's.
const PERIOD_REMINDER_ID_PREFIX = 'period-reminder:'

const userIdPrefix = (userId: string) => `${PERIOD_REMINDER_ID_PREFIX}${userId}:`

export interface PeriodReminderContent {
  title: string
  body: string
  channelName: string
}

// Serialize syncs so a quick enable/disable can't interleave its cancel and schedule calls.
let syncChain: Promise<unknown> = Promise.resolve()
function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const run = syncChain.then(fn, fn)
  syncChain = run.then(
    () => undefined,
    () => undefined,
  )
  return run
}

export const requestAppNotificationPermission = async () => {
  const existingPermissions = await Notifications.getPermissionsAsync()

  if (existingPermissions.granted) {
    return true
  }

  const requestedPermissions = await Notifications.requestPermissionsAsync()
  return requestedPermissions.granted
}

const cancelUserReminders = async (userId: string) => {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync()
  await Promise.all(
    scheduled
      .filter(({ identifier }) => identifier.startsWith(userIdPrefix(userId)))
      .map(({ identifier }) => Notifications.cancelScheduledNotificationAsync(identifier)),
  )
}

export const cancelPeriodReminders = (userId: string) =>
  enqueue(() => cancelUserReminders(userId))

// Replace this user's scheduled reminders with one notification per date. Never asks for
// permission: this runs on every Home focus, so asking is left to the Settings modal.
export const syncPeriodReminders = (
  userId: string,
  reminderDates: Moment[],
  content: PeriodReminderContent,
) =>
  enqueue(async () => {
    await cancelUserReminders(userId)

    if (!reminderDates.length) {
      return
    }

    const { granted } = await Notifications.getPermissionsAsync()
    if (!granted) {
      return
    }

    if (IS_ANDROID) {
      await Notifications.setNotificationChannelAsync(PERIOD_REMINDER_CHANNEL_ID, {
        name: content.channelName,
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      })
    }

    await Promise.all(
      reminderDates.map((date, index) =>
        Notifications.scheduleNotificationAsync({
          identifier: `${userIdPrefix(userId)}${index}`,
          content: {
            title: content.title,
            body: content.body,
            data: { type: 'period_reminder', userId },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: date.valueOf(),
            channelId: PERIOD_REMINDER_CHANNEL_ID,
          },
        }),
      ),
    )
  })

const getOpenedReminderIdentifier = () =>
  Notifications.getLastNotificationResponse()?.notification.request.identifier ?? null

// Clear this user's reminders once they are back in the app: the ones still in the notification
// tray, and the one they tapped to open the app.
export const dismissPeriodReminders = async (userId: string) => {
  if (getOpenedReminderIdentifier()?.startsWith(userIdPrefix(userId))) {
    Notifications.clearLastNotificationResponse()
  }
  const presented = await Notifications.getPresentedNotificationsAsync()
  await Promise.all(
    presented
      .filter(({ request }) => request.identifier.startsWith(userIdPrefix(userId)))
      .map(({ request }) => Notifications.dismissNotificationAsync(request.identifier)),
  )
}
