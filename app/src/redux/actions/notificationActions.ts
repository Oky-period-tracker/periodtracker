import { createAction } from '../helpers'
import { ReminderFrequency } from '../../services/notificationScheduler'

// null turns period reminders off
export function setNotificationReminder(reminderFrequency: ReminderFrequency | null) {
  return createAction('SET_NOTIFICATION_REMINDER', { reminderFrequency })
}
