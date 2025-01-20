import React, { PropsWithChildren } from 'react'
import { render } from '@testing-library/react-native'
import moment from 'moment'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { DatePicker } from '../../../src/components/DatePicker'

jest.mock('../../../src/hooks/useTranslate', () => ({
  useTranslate: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      test: 'test',
    }
    return translations[key] || key
  }),
}))

jest.mock('react-native-swipe-gestures', () => {
  return {
    __esModule: true,
    default: ({ children }: PropsWithChildren) => <>{children}</>, // Simple mock component that renders children
  }
})

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

describe('<DatePicker />', () => {
  it('renders the component', () => {
    const { getByTestId } = renderWithProvider(
      <DatePicker
        selectedDate={moment()}
        onDayPress={() => {
          //
        }}
      />,
    )

    expect(getByTestId('date-picker')).toBeTruthy()
  })
})
