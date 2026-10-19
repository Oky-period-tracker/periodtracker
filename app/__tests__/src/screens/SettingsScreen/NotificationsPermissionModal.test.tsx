import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react-native'
import {
  NotificationsPermissionModal,
  shouldShowNotificationsPermissionPrompt,
} from '../../../../src/screens/SettingsScreen/components/NotificationsPermissionModal'

jest.mock('../../../../src/components/Text', () => {
  const React = require('react')
  const { Text: RNText } = require('react-native')

  return {
    Text: ({ children, ...props }: any) => React.createElement(RNText, props, children),
  }
})

describe('<NotificationsPermissionModal />', () => {
  it('shows the reminder consent text and triggers actions', () => {
    const onCancel = jest.fn()
    const onProceed = jest.fn()

    render(
      <NotificationsPermissionModal visible={true} onCancel={onCancel} onProceed={onProceed} />,
    )

    expect(screen.getByText('Turn on notifications and reminders?')).toBeTruthy()
    expect(
      screen.getByText(
        'Oky can send you gentle reminders to help you follow your period and take care of yourself. You can always change your mind in the settings page.',
      ),
    ).toBeTruthy()

    fireEvent.press(screen.getByText('Cancel'))
    fireEvent.press(screen.getByText('Proceed'))

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onProceed).toHaveBeenCalledTimes(1)
  })

  it('does not show the consent prompt when reminders are already configured or already dismissed', () => {
    expect(shouldShowNotificationsPermissionPrompt(null)).toBe(true)
    expect(shouldShowNotificationsPermissionPrompt(null, true)).toBe(false)
    expect(shouldShowNotificationsPermissionPrompt('fiveDays')).toBe(false)
    expect(shouldShowNotificationsPermissionPrompt('threeDays')).toBe(false)
    expect(shouldShowNotificationsPermissionPrompt('oneDay')).toBe(false)
  })
})
