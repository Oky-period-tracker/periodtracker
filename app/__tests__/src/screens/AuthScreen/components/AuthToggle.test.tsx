import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { AuthToggle } from '../../../../../src/screens/AuthScreen/components/AuthToggle'

jest.mock('../../../../../src/hooks/useTranslate', () => ({
  useTranslate: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      sign_up: 'sign_up',
      log_in: 'log_in',
    }
    return translations[key] || key
  }),
}))

describe('<AuthToggle />', () => {
  it('renders the component', () => {
    render(<AuthToggle />)
    expect(screen.getByText('sign_up')).toBeTruthy()
    expect(screen.getByText('log_in')).toBeTruthy()
  })
})
