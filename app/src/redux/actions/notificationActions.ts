import { createAction } from '../helpers'

export type ReminderFrequency = 'fiveDays' | 'threeDays' | 'oneDay' | null

export function setNotificationReminder(reminderFrequency: ReminderFrequency) {
  return createAction('SET_NOTIFICATION_REMINDER', { reminderFrequency })
}

export function setNotificationsEnabled(isEnabled: boolean) {
  return createAction('SET_NOTIFICATIONS_ENABLED', { isEnabled })
}
