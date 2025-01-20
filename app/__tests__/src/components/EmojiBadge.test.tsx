import React from 'react'
import { render } from '@testing-library/react-native'
import { EmojiBadge } from '../../../src/components/EmojiBadge'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'

describe('<EmojiBadge />', () => {
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

  it('renders the component', () => {
    const { getByText } = renderWithProvider(<EmojiBadge text={'test'} />)
    expect(getByText('test')).toBeTruthy()
  })
})
