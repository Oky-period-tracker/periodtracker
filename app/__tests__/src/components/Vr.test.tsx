import React from 'react'
import { render } from '@testing-library/react-native'
import { Hr } from '../../../src/components/Hr'

describe('<Hr />', () => {
  it('renders the component', () => {
    const { getByTestId } = render(<Hr testID="hr" />)
    expect(getByTestId('hr')).toBeTruthy()
  })
})
