import moment from 'moment'
import * as Notifications from 'expo-notifications'
import {
  cancelPeriodReminders,
  dismissPeriodReminders,
  getPeriodReminderUserId,
  getUsersWithPeriodReminders,
  syncPeriodReminders,
} from '../../../src/services/periodReminderLocalNotification'

jest.mock('expo-notifications', () => ({
  getAllScheduledNotificationsAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  getPresentedNotificationsAsync: jest.fn(),
  dismissNotificationAsync: jest.fn(),
  getLastNotificationResponse: jest.fn(),
  clearLastNotificationResponse: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
  AndroidImportance: { HIGH: 4 },
  AndroidNotificationVisibility: { PUBLIC: 1 },
  SchedulableTriggerInputTypes: { DATE: 'date' },
}))
jest.mock('../../../src/services/device', () => ({ IS_ANDROID: true }))

const mocked = Notifications as jest.Mocked<typeof Notifications>

const content = { title: 'Oky', body: 'Hi Ana', channelName: 'Period reminders' }
const request = (identifier: string) => ({ request: { identifier } })

describe('periodReminderLocalNotification', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mocked.getAllScheduledNotificationsAsync.mockResolvedValue([
      { identifier: 'period-reminder:ana:0' },
      { identifier: 'period-reminder:ana:1' },
      { identifier: 'period-reminder:zoe:0' },
      { identifier: 'something-else' },
    ] as never)
    mocked.getPermissionsAsync.mockResolvedValue({ granted: true } as never)
    mocked.getPresentedNotificationsAsync.mockResolvedValue([] as never)
    mocked.getLastNotificationResponse.mockReturnValue(null)
  })

  it('replaces only this account’s reminders, one per date on the reminder channel', async () => {
    const dates = [moment('2026-03-17T08:00:00'), moment('2026-04-16T08:00:00')]

    await syncPeriodReminders('ana', dates, content)

    expect(mocked.cancelScheduledNotificationAsync.mock.calls).toEqual([
      ['period-reminder:ana:0'],
      ['period-reminder:ana:1'],
    ])
    expect(mocked.setNotificationChannelAsync).toHaveBeenCalledWith(
      'period-reminder',
      expect.objectContaining({ name: 'Period reminders' }),
    )
    expect(mocked.scheduleNotificationAsync.mock.calls.map(([input]) => input)).toEqual(
      dates.map((date, index) => ({
        identifier: `period-reminder:ana:${index}`,
        content: { title: 'Oky', body: 'Hi Ana', data: { type: 'period_reminder', userId: 'ana' } },
        trigger: { type: 'date', date: date.valueOf(), channelId: 'period-reminder' },
      })),
    )
  })

  it('never asks for permission while syncing, and schedules nothing without it', async () => {
    mocked.getPermissionsAsync.mockResolvedValue({ granted: false } as never)

    await syncPeriodReminders('ana', [moment('2026-03-17T08:00:00')], content)

    expect(mocked.requestPermissionsAsync).not.toHaveBeenCalled()
    expect(mocked.scheduleNotificationAsync).not.toHaveBeenCalled()
    expect(mocked.cancelScheduledNotificationAsync).toHaveBeenCalledTimes(2)
  })

  it('only cancels when there is nothing to schedule', async () => {
    await syncPeriodReminders('zoe', [], content)

    expect(mocked.cancelScheduledNotificationAsync.mock.calls).toEqual([['period-reminder:zoe:0']])
    expect(mocked.scheduleNotificationAsync).not.toHaveBeenCalled()
  })

  it('cancels a deleted account’s reminders without touching the others', async () => {
    await cancelPeriodReminders('zoe')

    expect(mocked.cancelScheduledNotificationAsync.mock.calls).toEqual([['period-reminder:zoe:0']])
  })

  it('reads the account id back from a reminder identifier', () => {
    expect(getPeriodReminderUserId('period-reminder:ana:11')).toBe('ana')
    expect(getPeriodReminderUserId('period-reminder:a1b2-c3:0')).toBe('a1b2-c3')
    expect(getPeriodReminderUserId('something-else')).toBeNull()
  })

  it('finds accounts with a reminder in the tray or the one that opened the app', async () => {
    mocked.getPresentedNotificationsAsync.mockResolvedValue([
      request('period-reminder:ana:0'),
      request('something-else'),
    ] as never)
    mocked.getLastNotificationResponse.mockReturnValue({
      notification: request('period-reminder:zoe:3'),
    } as never)

    expect(await getUsersWithPeriodReminders()).toEqual(new Set(['ana', 'zoe']))
  })

  it('dismisses only this account’s reminders once it is back in the app', async () => {
    mocked.getPresentedNotificationsAsync.mockResolvedValue([
      request('period-reminder:ana:0'),
      request('period-reminder:zoe:1'),
    ] as never)
    mocked.getLastNotificationResponse.mockReturnValue({
      notification: request('period-reminder:zoe:3'),
    } as never)

    await dismissPeriodReminders('ana')
    expect(mocked.dismissNotificationAsync.mock.calls).toEqual([['period-reminder:ana:0']])
    expect(mocked.clearLastNotificationResponse).not.toHaveBeenCalled()

    await dismissPeriodReminders('zoe')
    expect(mocked.clearLastNotificationResponse).toHaveBeenCalledTimes(1)
  })
})
