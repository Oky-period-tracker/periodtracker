import React from 'react'
import { render } from '@testing-library/react-native'
import { Circle } from '../../../../src/components/icons/Circle'

describe('<Circle />', () => {
  it('renders the component', () => {
    render(<Circle />)
    const { getByTestId } = render(<Circle />)
    expect(getByTestId('circle')).toBeTruthy()
  })
})
