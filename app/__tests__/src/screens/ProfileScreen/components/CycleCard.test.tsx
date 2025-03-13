import React from 'react'
import { render } from '@testing-library/react-native'
import { CycleCard } from '../../../../../src/screens/ProfileScreen/components/CycleCard'
import moment from 'moment'
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

jest.mock('../../../../../src/contexts/PredictionProvider', () => ({
  useTodayPrediction: jest.fn(() => ({
    onPeriod: false, // Mocked value for onPeriod
  })),
}))

jest.mock('../../../../../src/contexts/AuthContext', () => ({
  useAuth: jest.fn(() => ({
    isLoggedIn: true, // Mocked value for isLoggedIn
  })),
}))

const mockStore = configureMockStore()

const renderWithProvider = (ui: React.ReactElement) => {
  const store = mockStore({
    auth: {
      user: { id: '1', name: 'Test User' },
    },
    answer: {
      '1': {
        cards: {
          activity: 'exercise',
          body: 'tired',
          flow: 'none',
          mood: 'blah',
          periodDay: null,
        },
      },
    },
  })
  return render(<Provider store={store}>{ui}</Provider>)
}

describe('<CycleCard />', () => {
  it('renders the component', () => {
    const { getByTestId } = renderWithProvider(
      <CycleCard
        item={{ cycleStartDate: moment(), cycleEndDate: moment(), periodLength: 1, cycleLength: 1 }}
        cycleNumber={0}
      />,
    )
    expect(getByTestId('cycle')).toBeTruthy()
  })
})
