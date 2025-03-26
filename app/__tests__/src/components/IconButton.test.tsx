import React from 'react'
import { render } from '@testing-library/react-native'
import { IconButton } from '../../../src/components/IconButton'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'

jest.mock('../../../src/hooks/useTranslate', () => ({
  useTranslate: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      test: 'test',
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

describe('<IconButton />', () => {
  it('renders the component', () => {
    const { getByText } = renderWithProvider(<IconButton text="test" />)
    expect(getByText('test')).toBeTruthy()
  })
})
