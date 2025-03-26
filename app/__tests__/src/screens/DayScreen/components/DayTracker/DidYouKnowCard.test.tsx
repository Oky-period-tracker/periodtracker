import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { DidYouKnowCard } from '../../../../../../src/screens/DayScreen/components/DayTracker/DidYouKnowCard'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'

jest.mock('../../../../../../src/hooks/useTranslate', () => ({
  useTranslate: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      daily_didYouKnow_content: 'daily_didYouKnow_content',
    }
    return translations[key] || key
  }),
}))

const mockStore = configureMockStore()

const renderWithProvider = (ui: React.ReactElement) => {
  const store = mockStore({
    content: {
      didYouKnows: {
        byId: {},
        allIds: [],
      },
    },
  })
  return render(<Provider store={store}>{ui}</Provider>)
}

describe('<DidYouKnowCard />', () => {
  it('renders the component', () => {
    renderWithProvider(<DidYouKnowCard />)
    expect(screen.getByText('daily_didYouKnow_content')).toBeTruthy()
  })
})
