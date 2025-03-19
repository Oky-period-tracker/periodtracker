import React from 'react'
import { render } from '@testing-library/react-native'
import { Vr } from '../../../src/components/Vr'

describe('<Vr />', () => {
  it('renders the component', () => {
    const { getByTestId } = render(<Vr testID="vr" />)
    expect(getByTestId('vr')).toBeTruthy()
  })
})
