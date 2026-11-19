import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react-native'
import { NotificationsPermissionModal } from '../../../../src/screens/SettingsScreen/components/NotificationsPermissionModal'

jest.mock('../../../../src/hooks/useTranslate', () => ({
  useTranslate: () => (key: string) => key,
}))

jest.mock('../../../../src/hooks/useColor', () => ({
  useColor: () => ({
    color: '#000',
    backgroundColor: '#fff',
    palette: {
      basic: { highlight: '#eee' },
      danger: { base: '#f00', highlight: '#fff' },
    },
  }),
}))

describe('<NotificationsPermissionModal />', () => {
  it('renders translated reminder copy and triggers actions', () => {
    const onCancel = jest.fn()
    const onProceed = jest.fn()

    render(
      <NotificationsPermissionModal visible={true} onCancel={onCancel} onProceed={onProceed} />,
    )

    expect(screen.getByText('notifications_permission_prompt_title')).toBeTruthy()
    expect(screen.getByText('notifications_permission_prompt_description')).toBeTruthy()

    fireEvent.press(screen.getByText('cancel'))
    fireEvent.press(screen.getByText('proceed'))

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onProceed).toHaveBeenCalledTimes(1)
  })
})
