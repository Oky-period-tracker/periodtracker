import moment from 'moment'
import { PredictionEngine } from '../../../src/prediction/PredictionEngine'
import { PredictionState } from '../../../src/prediction/PredictionState'
import {
  getUpcomingReminderDates,
  isReminderDay,
} from '../../../src/services/notificationScheduler'

const prediction = (startDate: string, cycleLength: number, smaCycleLength: number) =>
  PredictionState.fromData({
    isActive: true,
    startDate: moment(startDate),
    periodLength: 5,
    cycleLength,
    smaPeriodLength: 5,
    smaCycleLength,
    history: [],
  })

const format = (dates: moment.Moment[]) => dates.map((date) => date.format('YYYY-MM-DD HH:mm'))

describe('getUpcomingReminderDates', () => {
  const now = moment('2026-03-01T10:00:00')

  it('schedules one reminder per upcoming cycle at 08:00, using the moving average after the current cycle', () => {
    const dates = getUpcomingReminderDates(prediction('2026-02-20', 28, 30), 'threeDays', 3, now)

    // Next period 2026-03-20 (start + 28), then every 30 days
    expect(format(dates)).toEqual(['2026-03-17 08:00', '2026-04-16 08:00', '2026-05-16 08:00'])
  })

  it('keeps scheduling after a late period instead of stopping at the past prediction', () => {
    const dates = getUpcomingReminderDates(prediction('2026-01-01', 28, 30), 'fiveDays', 1, now)

    // 2026-01-29 and 2026-02-28 have passed; the engine's next predicted start is 2026-03-30
    expect(format(dates)).toEqual(['2026-03-25 08:00'])
  })

  it('skips the current cycle when its offset has already passed', () => {
    const dates = getUpcomingReminderDates(prediction('2026-02-01', 30, 28), 'fiveDays', 1, now)

    // Period 2026-03-03 minus 5 days is in the past, so the first reminder is next cycle's
    expect(format(dates)).toEqual(['2026-03-26 08:00'])
  })

  it('includes a reminder later today but not one already sent this morning', () => {
    const state = prediction('2026-02-02', 28, 28) // period 2026-03-02, one day before = today

    expect(format(getUpcomingReminderDates(state, 'oneDay', 1, moment('2026-03-01T07:59:00')))).toEqual([
      '2026-03-01 08:00',
    ])
    expect(format(getUpcomingReminderDates(state, 'oneDay', 1, moment('2026-03-01T08:00:00')))).toEqual([
      '2026-03-29 08:00',
    ])
  })

  it('counts a start date with a time of day the way the prediction engine does', () => {
    // Onboarding stores UTC midnight: 25 Oct 00:00Z is the evening of 24 Oct behind UTC
    const dates = getUpcomingReminderDates(
      prediction('2026-10-24T20:00:00', 28, 28),
      'threeDays',
      1,
      moment('2026-11-08T13:00:00'),
    )

    // Cycle day 1 is 25 Oct, so the next period is 22 Nov and the reminder 19 Nov
    expect(format(dates)).toEqual(['2026-11-19 08:00'])
  })

  it.each([
    ['midnight', 0],
    ['evening', 20],
  ])(
    'lands each reminder the chosen number of days before a predicted period start (%s start)',
    (_, hour) => {
      const today = moment().startOf('day')
      const state = PredictionState.fromData({
        isActive: true,
        startDate: today.clone().subtract(10, 'days').hour(hour),
        periodLength: 5,
        cycleLength: 27,
        smaPeriodLength: 5,
        smaCycleLength: 31,
        history: [],
      })
      const engine = PredictionEngine.fromState(state)

      getUpcomingReminderDates(state, 'threeDays', 12).forEach((reminder) => {
        const periodStart = reminder.clone().startOf('day').add(3, 'days')
        expect(engine.predictDay(periodStart).cycleDay).toBe(1)
      })
    },
  )

  it('schedules nothing when there is no active prediction', () => {
    const inactive = PredictionState.fromData({ isActive: false })

    expect(getUpcomingReminderDates(inactive, 'oneDay', 12, now)).toEqual([])
    expect(getUpcomingReminderDates(null, 'oneDay', 12, now)).toEqual([])
  })
})

describe('isReminderDay', () => {
  const state = prediction('2026-02-20', 28, 28) // period 2026-03-20

  it('is true for the whole reminder day, also after 08:00', () => {
    expect(isReminderDay(state, 'threeDays', moment('2026-03-17T21:00:00'))).toBe(true)
  })

  it('is false on other days', () => {
    expect(isReminderDay(state, 'threeDays', moment('2026-03-16T09:00:00'))).toBe(false)
    expect(isReminderDay(state, 'fiveDays', moment('2026-03-17T09:00:00'))).toBe(false)
  })
})
