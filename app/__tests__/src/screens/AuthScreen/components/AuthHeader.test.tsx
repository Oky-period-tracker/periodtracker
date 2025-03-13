import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { AuthHeader } from '../../../../../src/screens/AuthScreen/components/AuthHeader'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'

jest.mock('../../../../../src/hooks/useTranslate', () => ({
  useTranslate: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      test: 'test',
    }
    return translations[key] || key
  }),
}))

const mockStore = configureMockStore()

const renderWithProvider = (ui: React.ReactElement) => {
  const store = mockStore({ auth: { user: { id: 1, name: 'Test User' } } })
  return render(<Provider store={store}>{ui}</Provider>)
}

describe('<AuthHeader />', () => {
  it('renders the component', () => {
    renderWithProvider(<AuthHeader title={'test'} />)
    expect(screen.getByText('test')).toBeTruthy()
  })
})
