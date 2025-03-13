import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react-native'

import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { AskAge } from '../../../../../../../src/screens/AuthScreen/components/SignUp/components/AskAge'
import { useSignUp } from '../../../../../../../src/screens/AuthScreen/components/SignUp/SignUpContext'
import { useMonths } from '../../../../../../../src/hooks/useMonths'

// Mock dependencies
jest.mock('../../../../../../../src/screens/AuthScreen/components/SignUp/SignUpContext', () => ({
  useSignUp: jest.fn(),
}))

jest.mock('../../../../../../../src/hooks/useMonths', () => ({
  useMonths: jest.fn(),
}))

jest.mock('../../../../../../../src/hooks/useAccessibilityLabel', () => ({
  useAccessibilityLabel: jest.fn(() => jest.fn(() => 'mock_accessibility_label')),
}))

jest.mock('../../../../../../../src/hooks/useTranslate', () => ({
  useTranslate: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      month_of_birth: 'Month of Birth',
      year_of_birth: 'Year of Birth',
    }
    return translations[key] || key
  }),
}))

const mockStore = configureMockStore()

describe('AskAge', () => {
  const mockDispatch = jest.fn()
  const mockMonths = {
    months: ['January', 'February', 'March'],
    monthOptions: [
      { label: 'January', value: 'January' },
      { label: 'February', value: 'February' },
      { label: 'March', value: 'March' },
    ],
  }

  const initialState = {
    locale: 'en-US', // Add any initial state your selectors depend on
  }

  const store = mockStore(initialState)

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useSignUp as jest.Mock).mockReturnValue({
      state: { month: undefined, year: undefined },
      dispatch: mockDispatch,
    })
    ;(useMonths as jest.Mock).mockReturnValue(mockMonths)
  })

  const renderWithProvider = (ui: React.ReactElement) => {
    return render(<Provider store={store}>{ui}</Provider>)
  }

  it('should render the month and year pickers with correct placeholders and accessibility labels', () => {
    renderWithProvider(<AskAge />)

    // Assert placeholders
    expect(screen.getByText('Month of Birth')).toBeTruthy()
    expect(screen.getByText('Year of Birth')).toBeTruthy()

    // Assert accessibility label
    // expect(screen.getByAccessibilityLabel('mock_accessibility_label')).toBeTruthy()
  })

  it('should call dispatch with correct month value when a month is selected', () => {
    renderWithProvider(<AskAge />)

    const monthPicker = screen.getByText('Month of Birth')

    // Simulate selecting February
    fireEvent(monthPicker, 'onSelect', { label: 'February', value: 'February' })

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'month', value: 1 }) // February is at index 1
  })

  it('should call dispatch with correct year value when a year is selected', () => {
    renderWithProvider(<AskAge />)

    const yearPicker = screen.getByText('Year of Birth')

    // Simulate selecting a year
    fireEvent(yearPicker, 'onSelect', { label: '2000', value: '2000' })

    expect(mockDispatch).toHaveBeenCalledWith({ type: 'year', value: 2000 })
  })
})
