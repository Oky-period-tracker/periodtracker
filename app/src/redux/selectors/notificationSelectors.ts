import { ReduxState } from '../reducers'

export const notificationReminderFrequencySelector = (state: ReduxState) =>
  state.notification.reminderFrequency
