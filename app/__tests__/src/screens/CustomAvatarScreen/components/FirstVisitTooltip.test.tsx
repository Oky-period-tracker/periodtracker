import React from 'react'
import { render, fireEvent } from '@testing-library/react-native'
import { FirstVisitTooltip } from '../../../../../src/screens/CustomAvatarScreen/components/FirstVisitTooltip'

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

describe('<FirstVisitTooltip />', () => {
  const mockOnClose = jest.fn()

  const defaultStyles = {
    firstVisitTooltip: {},
    tooltipContent: {},
    tooltipText: {},
    tooltipCloseButton: {},
    tooltipTriangle: {},
  }

  const defaultProps = {
    visible: true,
    onClose: mockOnClose,
    styles: defaultStyles as any,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders when visible is true', () => {
    const { getByText } = render(<FirstVisitTooltip {...defaultProps} />)
    expect(getByText('customizer_first_visit_tooltip')).toBeTruthy()
  })

  it('does not render when visible is false', () => {
    const { queryByText } = render(
      <FirstVisitTooltip {...defaultProps} visible={false} />
    )
    expect(queryByText('customizer_first_visit_tooltip')).toBeNull()
  })

  it('calls onClose when close button is pressed', () => {
    const { getByLabelText } = render(<FirstVisitTooltip {...defaultProps} />)
    const closeButton = getByLabelText('close_tooltip_button')

    fireEvent.press(closeButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('displays the tooltip text', () => {
    const { getByText } = render(<FirstVisitTooltip {...defaultProps} />)
    expect(getByText('customizer_first_visit_tooltip')).toBeTruthy()
  })
})

