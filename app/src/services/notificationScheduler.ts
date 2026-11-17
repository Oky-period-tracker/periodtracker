import moment, { Moment } from 'moment'
import type { PredictionState } from '../prediction'

export type ReminderFrequency = 'fiveDays' | 'threeDays' | 'oneDay'

const REMINDER_DAYS_OFFSET: Record<ReminderFrequency, number> = {
  fiveDays: 5,
  threeDays: 3,
  oneDay: 1,
}

const REMINDER_HOUR = 8

// Reminders are scheduled this many cycles ahead, so they keep firing for about a year even if
// the app is never reopened. Every app open schedules them again from the latest prediction.
export const REMINDER_CYCLES_AHEAD = 12

// 08:00 reminder dates for the upcoming predicted periods, skipping any already past `now`.
// The current cycle uses its own length and every later one the moving average, the same way
// PredictionEngine.predictDay projects future cycles.
export const getUpcomingReminderDates = (
  prediction: PredictionState | null | undefined,
  frequency: ReminderFrequency,
  count: number,
  now: Moment = moment(),
): Moment[] => {
  if (!prediction?.isActive || !prediction.currentCycle?.startDate) {
    return []
  }

  const cycleLength = Math.round(Number(prediction.currentCycle.cycleLength))
  const smaCycleLength = Math.round(Number(prediction.smartPrediction?.smaCycleLength))

  if (!(cycleLength > 0) || !(smaCycleLength > 0)) {
    return []
  }

  // The start date often carries a time (onboarding stores UTC midnight, i.e. the previous
  // evening in timezones behind UTC). predictDay counts whole days from it, so cycle day 1 is the
  // first local midnight at or after the start, not the start's own calendar day.
  const startDate = moment(prediction.currentCycle.startDate)
  const periodDate = startDate.clone().startOf('day')
  if (startDate.isAfter(periodDate)) {
    periodDate.add(1, 'day')
  }
  periodDate.add(cycleLength, 'days')
  const reminders: Moment[] = []

  while (reminders.length < count) {
    const reminder = periodDate
      .clone()
      .subtract(REMINDER_DAYS_OFFSET[frequency], 'days')
      .hour(REMINDER_HOUR)

    if (reminder.isAfter(now)) {
      reminders.push(reminder)
    }
    periodDate.add(smaCycleLength, 'days')
  }

  return reminders
}

export const isReminderDay = (
  prediction: PredictionState | null | undefined,
  frequency: ReminderFrequency,
  today: Moment = moment(),
): boolean => {
  const [nextReminder] = getUpcomingReminderDates(
    prediction,
    frequency,
    1,
    today.clone().startOf('day'),
  )
  return !!nextReminder && nextReminder.isSame(today, 'day')
}
