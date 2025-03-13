import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { Checkbox } from '../../../src/components/Checkbox'

jest.mock('../../../src/hooks/useTranslate', () => ({
  useTranslate: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      test: 'test',
    }
    return translations[key] || key
  }),
}))

describe('<Checkbox />', () => {
  it('renders the component', () => {
    render(
      <Checkbox
        label="test"
        checked
        onPress={() => {
          //
        }}
      />,
    )
    expect(screen.getByText('test')).toBeTruthy()
  })
})
