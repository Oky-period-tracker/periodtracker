import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { AuthLinks } from '../../../../../src/screens/AuthScreen/components/AuthLinks'

const mockUsersWithReminders = new Set<string>()

jest.mock('../../../../../src/hooks/useTranslate', () => ({
  useTranslate: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      forgot_password: 'forgot_password',
      delete_account: 'delete_account',
      manage_users: 'manage_users',
    }
    return translations[key] || key
  }),
}))

jest.mock('../../../../../src/hooks/useUsersWithPeriodReminders', () => ({
  useUsersWithPeriodReminders: () => mockUsersWithReminders,
}))

describe('<AuthLinks />', () => {
  beforeEach(() => mockUsersWithReminders.clear())

  it('renders the component', () => {
    render(<AuthLinks />)
    expect(screen.getByText('forgot_password')).toBeTruthy()
    expect(screen.getByText('delete_account')).toBeTruthy()
    expect(screen.getByText('manage_users')).toBeTruthy()
    expect(screen.queryByLabelText('period_reminder_waiting')).toBeNull()
  })

  it('shows a dot on manage users when an account has a period reminder waiting', () => {
    mockUsersWithReminders.add('ana')
    render(<AuthLinks />)
    expect(screen.getByLabelText('period_reminder_waiting')).toBeTruthy()
  })
})
