import React from 'react'
import { render } from '@testing-library/react-native'
import { CheckButton } from '../../../src/components/CheckButton'

jest.mock('../../../src/hooks/useTranslate', () => ({
  useTranslate: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      test: 'test',
    }
    return translations[key] || key
  }),
}))

describe('<CheckButton />', () => {
  it('renders the component', () => {
    const { getByTestId } = render(<CheckButton testID="test" style={{ opacity: 0 }}></CheckButton>)
    expect(getByTestId('test')).toBeTruthy()
  })
})
