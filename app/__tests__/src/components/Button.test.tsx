import React from 'react'
import { render, screen } from '@testing-library/react-native'
import { Button } from '../../../src/components/Button'

jest.mock('../../../src/hooks/useTranslate', () => ({
  useTranslate: jest.fn(() => (key: string) => {
    const translations: Record<string, string> = {
      test: 'test',
    }
    return translations[key] || key
  }),
}))

describe('<Button />', () => {
  it('renders the component', () => {
    render(<Button>test</Button>)
    expect(screen.getByText('test')).toBeTruthy()
  })
})
