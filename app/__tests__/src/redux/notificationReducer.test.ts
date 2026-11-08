import { notificationReducer } from '../../../src/redux/reducers/notificationReducer'
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
})
