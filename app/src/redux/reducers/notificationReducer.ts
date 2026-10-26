import { Actions } from '../types'
import { RehydrateAction, REHYDRATE } from 'redux-persist'
import { ReminderFrequency } from '../actions/notificationActions'

export interface NotificationState {
  isEnabled: boolean
  reminderFrequency: ReminderFrequency
}

const initialState: NotificationState = {
  isEnabled: false,
  reminderFrequency: null,
}

export function notificationReducer(
  state = initialState,
  action: Actions | RehydrateAction,
): NotificationState {
  switch (action.type) {
    case REHYDRATE: {
      return {
        ...state,
        ...(action.payload && action.payload.notification),
      }
    }
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
    case 'SET_NOTIFICATIONS_ENABLED':
      return {
        ...state,
        isEnabled: action.payload.isEnabled,
      }
    default:
      return state
  }
}
