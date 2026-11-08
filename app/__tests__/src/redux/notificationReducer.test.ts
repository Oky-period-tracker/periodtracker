import { notificationReducer } from '../../../src/redux/reducers/notificationReducer'
import { refreshStore } from '../../../src/redux/actions/appActions'
import { setNotificationReminder } from '../../../src/redux/actions/notificationActions'

describe('notificationReducer', () => {
  const initial = notificationReducer(undefined, { type: '@@INIT' } as never)

  it('starts with reminders off', () => {
    expect(initial).toEqual({ reminderFrequency: null })
  })

  it('sets and clears the reminder frequency', () => {
    const on = notificationReducer(initial, setNotificationReminder('fiveDays'))
    expect(on.reminderFrequency).toBe('fiveDays')
    expect(notificationReducer(on, setNotificationReminder(null)).reminderFrequency).toBeNull()
  })

  it('restores the setting from the server store on login', () => {
    const restored = notificationReducer(
      initial,
      refreshStore({ userID: 'u1', notification: { reminderFrequency: 'oneDay' } }),
    )
    expect(restored.reminderFrequency).toBe('oneDay')
  })

  it('keeps the current setting when the server store predates reminders', () => {
    const on = notificationReducer(initial, setNotificationReminder('threeDays'))
    expect(notificationReducer(on, refreshStore({ userID: 'u1' })).reminderFrequency).toBe(
      'threeDays',
    )
  })
})
