import moment, { Moment } from 'moment'

export type ReminderFrequency = 'fiveDays' | 'threeDays' | 'oneDay'

// Notification messages to randomly select from
const NOTIFICATION_MESSAGES = [
  "It's a good day to check in with Oky!",
  "Have you checked in with Oky today?",
]

/**
 * Get random notification message
 */
export const getRandomNotificationMessage = (): string => {
  return NOTIFICATION_MESSAGES[Math.floor(Math.random() * NOTIFICATION_MESSAGES.length)]
}

/**
 * Convert reminder frequency to number of days
 */
const getReminderDaysOffset = (frequency: ReminderFrequency): number => {
  switch (frequency) {
    case 'fiveDays':
      return 5
    case 'threeDays':
      return 3
    case 'oneDay':
      return 1
    default:
      return 5
  }
}

/**
 * Calculate the reminder date based on predicted period and frequency
 * @param predictedPeriodDate - User's predicted period start date
 * @param reminderFrequency - How many days before (5/3/1)
 * @returns The date when notification should be sent
 */
export const calculateReminderDate = (
  predictedPeriodDate: Moment | Date | string,
  reminderFrequency: ReminderFrequency,
): Moment => {
  const periodDate = moment(predictedPeriodDate).startOf('day')
  const daysOffset = getReminderDaysOffset(reminderFrequency)
  return periodDate.clone().subtract(daysOffset, 'days')
}

/**
 * Store notification schedule in Redux/AsyncStorage for later reference
 * This data will be used to:
 * 1. Show inner-layer pop-up when user opens app on reminder day
 * 2. Be sent to backend for Firebase scheduling (future implementation)
 */
export interface NotificationSchedule {
  predictedPeriodDate: string // ISO date string
  reminderFrequency: ReminderFrequency
  reminderDate: string // ISO date string of when reminder should trigger
  notificationMessage: string
}

/**
 * Create notification schedule
 */
export const createNotificationSchedule = (
  predictedPeriodDate: Moment | Date | string,
  reminderFrequency: ReminderFrequency,
): NotificationSchedule => {
  const reminderDate = calculateReminderDate(predictedPeriodDate, reminderFrequency)

  return {
    predictedPeriodDate: moment(predictedPeriodDate).toISOString(),
    reminderFrequency,
    reminderDate: reminderDate.toISOString(),
    notificationMessage: getRandomNotificationMessage(),
  }
}

/**
 * Check if today is a reminder day
 * @param predictedPeriodDate - User's predicted period start date
 * @param reminderFrequency - How many days before (5/3/1)
 * @returns true if today is the reminder day
 */
export const isReminderDay = (
  predictedPeriodDate: Moment | Date | string,
  reminderFrequency: ReminderFrequency,
): boolean => {
  const reminderDate = calculateReminderDate(predictedPeriodDate, reminderFrequency)
  const today = moment().startOf('day')
  return reminderDate.isSame(today, 'day')
}

/**
 * Get days remaining until reminder day
 */
export const getDaysUntilReminder = (
  predictedPeriodDate: Moment | Date | string,
  reminderFrequency: ReminderFrequency,
): number => {
  const reminderDate = calculateReminderDate(predictedPeriodDate, reminderFrequency)
  const today = moment().startOf('day')
  return reminderDate.diff(today, 'days')
}

