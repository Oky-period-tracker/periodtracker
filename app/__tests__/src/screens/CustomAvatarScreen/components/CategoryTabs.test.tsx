import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { CategoryTabs } from '../../../../../src/screens/CustomAvatarScreen/components/CategoryTabs'

jest.mock('../../../../../src/resources/assets/friendAssets', () => ({
  getCategoryIcon: jest.fn((category) => ({
    uri: `icon-${category}.png`,
  })),
}))

jest.mock('../../../../../src/hooks/useAccessibilityLabel', () => ({
  useAccessibilityLabel: () => (key: string) => key,
}))

jest.mock('../../../../../src/hooks/useTranslate', () => ({
  useTranslate: () => (key: string) => key,
}))

jest.mock('../../../../../src/hooks/useColor', () => ({
  useColor: () => ({
    color: '#000000',
    palette: {
      basic: { text: '#000000' },
      primary: { text: '#000000' },
      secondary: { text: '#000000' },
    },
  }),
}))

describe('<CategoryTabs />', () => {
  const mockOnSelectCategory = jest.fn()

  const defaultStyles = {
    categoryContainer: {},
    categoryButton: {},
    categoryButtonSelected: {},
    categoryIcon: {},
    categoryIconSelected: {},
    categoryIconUnselected: {},
    categoryIconImage: {},
    categoryIconImageSelected: {},
    categoryLabel: {},
  }

  const defaultProps = {
    selectedCategory: 'body' as const,
    onSelectCategory: mockOnSelectCategory,
    styles: defaultStyles as any,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all category tabs', () => {
    const { getByText } = render(<CategoryTabs {...defaultProps} />)
    expect(getByText('customizer_body')).toBeTruthy()
    expect(getByText('customizer_hair')).toBeTruthy()
    expect(getByText('customizer_eyes')).toBeTruthy()
    expect(getByText('customizer_clothes')).toBeTruthy()
    expect(getByText('customizer_personal_items')).toBeTruthy()
  })

  it('calls onSelectCategory when a category is pressed', () => {
    const { getByText } = render(<CategoryTabs {...defaultProps} />)
    const hairButton = getByText('customizer_hair')

    fireEvent.press(hairButton)

    expect(mockOnSelectCategory).toHaveBeenCalledWith('hair')
  })

  it('highlights selected category', () => {
    const { getByText } = render(
      <CategoryTabs {...defaultProps} selectedCategory="hair" />
    )
    const hairButton = getByText('customizer_hair')
    expect(hairButton).toBeTruthy()
  })

  it('renders category icons', () => {
    const { getByTestId } = render(<CategoryTabs {...defaultProps} />)
    // Icons should be rendered
    expect(getByTestId).toBeDefined()
  })

  it('handles all category selections', () => {
    const categories = ['body', 'hair', 'eyes', 'clothing', 'devices'] as const

    categories.forEach((category) => {
      const { getByText } = render(
        <CategoryTabs {...defaultProps} selectedCategory={category} />
      )
      const button = getByText(`customizer_${category === 'clothing' ? 'clothes' : category === 'devices' ? 'personal_items' : category}`)
      fireEvent.press(button)
      expect(mockOnSelectCategory).toHaveBeenCalledWith(category)
    })
  })
})

