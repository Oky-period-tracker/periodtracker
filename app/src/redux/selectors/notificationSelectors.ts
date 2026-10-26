import { ReduxState } from '../reducers'

export const notificationReminderFrequencySelector = (state: ReduxState) =>
  state.notification.reminderFrequency

export const notificationsEnabledSelector = (state: ReduxState) =>
  state.notification.isEnabled
