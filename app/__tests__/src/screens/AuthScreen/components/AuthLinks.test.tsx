import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { AuthLinks } from '../../../../../src/screens/AuthScreen/components/AuthLinks'

jest.mock('../../../../../src/hooks/useTranslate', () => ({
  useTranslate: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      forgot_password: 'forgot_password',
      delete_account: 'delete_account',
    }
    return translations[key] || key
  }),
}))

describe('<AuthLinks />', () => {
  it('renders the component', () => {
    render(<AuthLinks />)
    expect(screen.getByText('forgot_password')).toBeTruthy()
    expect(screen.getByText('delete_account')).toBeTruthy()
  })
})
