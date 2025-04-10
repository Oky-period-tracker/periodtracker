import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { ErrorText } from '../../../src/components/ErrorText'

jest.mock('../../../src/hooks/useTranslate', () => ({
  useTranslate: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      test: 'test',
    }
    return translations[key] || key
  }),
}))

describe('<ErrorText />', () => {
  it('renders the component', () => {
    render(<ErrorText>test</ErrorText>)
    expect(screen.getByText('test')).toBeTruthy()
  })
})
