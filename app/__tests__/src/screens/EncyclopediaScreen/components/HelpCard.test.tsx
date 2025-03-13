import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { HelpCard } from '../../../../../src/screens/EncyclopediaScreen/components/HelpCard'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'

jest.mock('../../../../../src/hooks/useTranslate', () => ({
  useTranslate: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      'find help': 'find help',
    }
    return translations[key] || key
  }),
}))

const mockStore = configureMockStore()

const renderWithProvider = (ui: React.ReactElement) => {
  const store = mockStore({
    auth: { user: { id: 1, name: 'Test User' } },
    app: { theme: 'hills' },
  })
  return render(<Provider store={store}>{ui}</Provider>)
}

describe('<HelpCard />', () => {
  it('renders the component', () => {
    renderWithProvider(<HelpCard />)
    expect(screen.getByText('find help')).toBeTruthy()
  })
})
