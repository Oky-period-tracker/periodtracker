import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { HelpCenterCard } from '../../../../../src/screens/FindHelpScreen/components/HelpCenterCard'

jest.mock('../../../../../src/hooks/useTranslate', () => ({
  useTranslate: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      string: 'string',
      test: 'test',
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

const renderWithProvider = (ui: React.ReactElement) => {
  const store = mockStore({
    auth: { user: { id: 1, name: 'Test User' } },
    helpCenters: {
      savedHelpCenterIds: [],
    },
    content: {
      helpCenterAttributes: [],
    },
  })
  return render(<Provider store={store}>{ui}</Provider>)
}

describe('<HelpCenterCard />', () => {
  it('renders the component', () => {
    renderWithProvider(
      <HelpCenterCard
        helpCenter={{
          id: 1,
          title: 'test',
          caption: 'string',
          contactOne: 'string',
          address: 'string',
          website: 'string',
          lang: 'string',
        }}
        isSaved={false}
        onSavePress={() => {
          //
        }}
      />,
    )
    expect(screen.getByText('test')).toBeTruthy()
  })
})
