import React from 'react'
import { render, screen } from '@testing-library/react-native'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { Background } from '../../../src/components/Background'
import { Text } from 'react-native'

jest.mock('../../../src/contexts/PredictionProvider', () => ({
  useTodayPrediction: jest.fn(() => ({
    onPeriod: false, // Mocked value for onPeriod
  })),
}))

jest.mock('../../../src/contexts/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    isLoggedIn: true, // Mocked value for isLoggedIn
  })),
}))

jest.mock('../../../src/hooks/useTranslate', () => ({
  useTranslate: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      test: 'test',
    }
    return translations[key] || key
  }),
}))

jest.mock('react-native-reanimated', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Reanimated = require('react-native-reanimated/mock')

  // Mock the `call` function to avoid errors
  Reanimated.default.call = () => {}

  return Reanimated
})

const mockStore = configureMockStore()

const renderWithProvider = (ui: React.ReactElement) => {
  const store = mockStore({
    auth: { user: { id: 1, name: 'Test User' } },
    app: { theme: 'hills' },
  })
  return render(<Provider store={store}>{ui}</Provider>)
}

describe('<AuthHeader />', () => {
  it('renders the component', () => {
    renderWithProvider(
      <Background>
        <Text>test</Text>
      </Background>,
    )
    expect(screen.getByText('test')).toBeTruthy()
  })
})
