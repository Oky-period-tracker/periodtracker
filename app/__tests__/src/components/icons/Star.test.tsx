import React from 'react'
import { render } from '@testing-library/react-native'
import { Star } from '../../../../src/components/icons/Star'

describe('<Star />', () => {
  it('renders the component', () => {
    render(<Star />)
    const { getByTestId } = render(<Star />)
    expect(getByTestId('star')).toBeTruthy()
  })
})
