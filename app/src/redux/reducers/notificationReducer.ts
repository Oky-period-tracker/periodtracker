import { Actions } from '../types'
import { ReminderFrequency } from '../../services/notificationScheduler'

export interface NotificationState {
  // null when period reminders are off
  reminderFrequency: ReminderFrequency | null
}

const initialState: NotificationState = {
  reminderFrequency: null,
}

export function notificationReducer(
  state = initialState,
  action: Actions,
): NotificationState {
  switch (action.type) {
    case 'REFRESH_STORE': {
      if (!action?.payload?.notification) {
        return state
      }
      return {
        ...state,
        ...action.payload.notification,
      }
    }
    case 'SET_NOTIFICATION_REMINDER':
      return {
        ...state,
        reminderFrequency: action.payload.reminderFrequency,
      }
    default:
      return state
  }
}
