import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { AskLocation } from '../../../../../../../src/screens/AuthScreen/components/SignUp/components/AskLocation'

jest.mock('../../../../../../../src/hooks/useTranslate', () => ({
  useTranslate: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      Urban: 'Urban',
    }
    return translations[key] || key
  }),
}))

const mockStore = configureMockStore()

describe('<AskLocation />', () => {
  const renderWithProvider = (ui: React.ReactElement) => {
    const store = mockStore({})
    return render(<Provider store={store}>{ui}</Provider>)
  }

  it('renders the component', () => {
    renderWithProvider(<AskLocation />)
    expect(screen.getByText('Urban')).toBeTruthy()
  })
})
