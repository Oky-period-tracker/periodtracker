import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'

import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { AskAgree } from '../../../../../../../src/screens/AuthScreen/components/SignUp/components/AskAgree'
import { useSignUp } from '../../../../../../../src/screens/AuthScreen/components/SignUp/SignUpContext'

// Mock dependencies
jest.mock('../../../../../../../src/screens/AuthScreen/components/SignUp/SignUpContext', () => ({
  useSignUp: jest.fn(),
}))

jest.mock('../../../../../../../src/hooks/useAccessibilityLabel', () => ({
  useAccessibilityLabel: jest.fn(() => jest.fn((key: string) => `mock_accessibility_label_${key}`)),
}))

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    navigate: jest.fn(),
  })),
}))

jest.mock('../../../../../../../src/hooks/useTranslate', () => ({
  useTranslate: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      accept_conditions_1: 'Please agree to the terms.',
      accept_conditions_2: 'Privacy Policy',
      accept_conditions_3: 'and',
      accept_conditions_4: 'Terms and Conditions.',
      accept_conditions_5: 'Check the box below to proceed.',
      i_agree: 'I agree',
    }
    return translations[key] || key
  }),
}))

jest.mock('expo-linking', () => ({
  createURL: jest.fn(() => 'mocked-url'),
  openURL: jest.fn(),
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  getInitialURL: jest.fn(() => Promise.resolve('mocked-url')),
}))

const mockStore = configureMockStore()

describe('AskAgree', () => {
  const mockDispatch = jest.fn()

  const initialState = {
    locale: 'en-US', // Add any initial state your selectors depend on
  }

  const store = mockStore(initialState)

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSignUp as jest.Mock).mockReturnValue({
      state: { agree: false },
      dispatch: mockDispatch,
    })
  })

  const renderWithProvider = (ui: React.ReactElement) => {
    return render(<Provider store={store}>{ui}</Provider>)
  }

  it('should render the component with links and a checkbox', () => {
    renderWithProvider(<AskAgree />)

    // Assert text content
    expect(screen.getByText('Please agree to the terms.')).toBeTruthy()
    expect(screen.getByText('Privacy Policy')).toBeTruthy()
    expect(screen.getByText('Terms and Conditions.')).toBeTruthy()
    expect(screen.getByText('Check the box below to proceed.')).toBeTruthy()
  })

  it('should navigate to Privacy Policy when the link is clicked', () => {
    const mockNavigate = jest.fn()
    ;(jest.requireMock('@react-navigation/native').useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
    })

    renderWithProvider(<AskAgree />)

    const privacyLink = screen.getByLabelText('mock_accessibility_label_privacy_policy_link')
    fireEvent.press(privacyLink)

    expect(mockNavigate).toHaveBeenCalledWith('Privacy')
  })

  it('should navigate to Terms and Conditions when the link is clicked', () => {
    const mockNavigate = jest.fn()
    ;(jest.requireMock('@react-navigation/native').useNavigation as jest.Mock).mockReturnValue({
      navigate: mockNavigate,
    })

    renderWithProvider(<AskAgree />)

    const termsLink = screen.getByLabelText('mock_accessibility_label_t_and_c_link')
    fireEvent.press(termsLink)

    expect(mockNavigate).toHaveBeenCalledWith('Terms')
  })
})
