import moment, { Moment } from 'moment'
import type { PredictionState } from '../prediction'

export type ReminderFrequency = 'fiveDays' | 'threeDays' | 'oneDay'

const NOTIFICATION_MESSAGES = [
  "It's a good day to check in with Oky!",
  "Have you checked in with Oky today?",
]

export const getRandomNotificationMessage = (): string => {
  return NOTIFICATION_MESSAGES[Math.floor(Math.random() * NOTIFICATION_MESSAGES.length)]
}

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

export const calculateReminderDate = (
  predictedPeriodDate: Moment | Date | string,
  reminderFrequency: ReminderFrequency,
): Moment => {
  const periodDate = moment(predictedPeriodDate).startOf('day')
  const daysOffset = getReminderDaysOffset(reminderFrequency)
  return periodDate.clone().subtract(daysOffset, 'days')
}

export const isReminderDay = (
  predictedPeriodDate: Moment | Date | string,
  reminderFrequency: ReminderFrequency,
): boolean => {
  const reminderDate = calculateReminderDate(predictedPeriodDate, reminderFrequency)
  const today = moment().startOf('day')
  return reminderDate.isSame(today, 'day')
}

export const getNextPredictedPeriodDate = (
  predictionFullState: PredictionState | null | undefined,
): Moment | null => {
  if (!predictionFullState?.isActive) {
    return null
  }

  if (!predictionFullState?.currentCycle?.startDate) {
    return null
  }

  const cycleLength = Number(predictionFullState?.currentCycle?.cycleLength)

  if (!Number.isFinite(cycleLength) || cycleLength <= 0) {
    return null
  }

  return moment(predictionFullState.currentCycle.startDate)
    .clone()
    .add(cycleLength, 'days')
    .startOf('day')
}
