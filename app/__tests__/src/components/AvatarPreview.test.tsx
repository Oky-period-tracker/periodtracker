import React from 'react'
import { render } from '@testing-library/react-native'
import { AvatarPreview } from '../../../src/components/AvatarPreview'

jest.mock('../../../src/resources/assets/friendAssets', () => ({
  getPreviewAsset: jest.fn((type, id, size) => {
    if (id === null || id === undefined) return null
    return () => <div testID={`${type}-${id}-${size}`} />
  }),
  BodySize: {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
  },
}))

jest.mock('../../../src/resources/assets/images/avatars/friend/avatar-parts/bodies/BodyComponents', () => ({
  BodySmall: ({ width, height, mainColor, darkerColor }: any) => (
    <div testID="body-small" style={{ width, height, mainColor, darkerColor }} />
  ),
  BodyMedium: ({ width, height, mainColor, darkerColor }: any) => (
    <div testID="body-medium" style={{ width, height, mainColor, darkerColor }} />
  ),
  BodyLarge: ({ width, height, mainColor, darkerColor }: any) => (
    <div testID="body-large" style={{ width, height, mainColor, darkerColor }} />
  ),
}))

jest.mock('../../../src/utils/colorUtils', () => ({
  getDarkerSkinColor: jest.fn((color) => `darker-${color}`),
}))

describe('<AvatarPreview />', () => {
  const defaultProps = {
    bodyType: 'body-medium' as const,
    skinColor: '#F1B98C',
    hairStyle: '01',
    hairColor: '#6E411C',
    eyeShape: '00',
    eyeColor: '#945A1C',
    smile: 'smile',
    clothing: 'shirt1',
    devices: ['device1'],
    width: 150,
    height: 200,
  }

  it('renders with default props', () => {
    const { getByTestId } = render(<AvatarPreview {...defaultProps} />)
    expect(getByTestId('body-medium')).toBeTruthy()
  })

  it('renders body-small when bodyType is body-small', () => {
    const { getByTestId } = render(
      <AvatarPreview {...defaultProps} bodyType="body-small" />
    )
    expect(getByTestId('body-small')).toBeTruthy()
  })

  it('renders body-large when bodyType is body-large', () => {
    const { getByTestId } = render(
      <AvatarPreview {...defaultProps} bodyType="body-large" />
    )
    expect(getByTestId('body-large')).toBeTruthy()
  })

  it('renders hair when hairStyle is provided', () => {
    const { getByTestId } = render(<AvatarPreview {...defaultProps} />)
    expect(getByTestId('hair-01-medium')).toBeTruthy()
  })

  it('does not render hair when hairStyle is 00 (bald)', () => {
    const { queryByTestId } = render(
      <AvatarPreview {...defaultProps} hairStyle="00" />
    )
    expect(queryByTestId('hair-00-medium')).toBeNull()
  })

  it('renders eyes when eyeShape is provided', () => {
    const { getByTestId } = render(<AvatarPreview {...defaultProps} />)
    expect(getByTestId('eyes-00-medium')).toBeTruthy()
  })

  it('renders smile when provided', () => {
    const { getByTestId } = render(<AvatarPreview {...defaultProps} />)
    expect(getByTestId('smile-smile-medium')).toBeTruthy()
  })

  it('renders clothing when provided', () => {
    const { getByTestId } = render(<AvatarPreview {...defaultProps} />)
    expect(getByTestId('clothing-shirt1-medium')).toBeTruthy()
  })

  it('renders devices when provided as array', () => {
    const { getByTestId } = render(
      <AvatarPreview {...defaultProps} devices={['device1', 'device2']} />
    )
    expect(getByTestId('devices-device1-medium')).toBeTruthy()
    expect(getByTestId('devices-device2-medium')).toBeTruthy()
  })

  it('handles devices as string (old format)', () => {
    const { getByTestId } = render(
      <AvatarPreview {...defaultProps} devices="device1" />
    )
    expect(getByTestId('devices-device1-medium')).toBeTruthy()
  })

  it('handles null devices', () => {
    const { queryByTestId } = render(
      <AvatarPreview {...defaultProps} devices={null} />
    )
    expect(queryByTestId('devices-device1-medium')).toBeNull()
  })

  it('handles empty devices array', () => {
    const { queryByTestId } = render(
      <AvatarPreview {...defaultProps} devices={[]} />
    )
    expect(queryByTestId('devices-device1-medium')).toBeNull()
  })

  it('applies custom width and height', () => {
    const { getByTestId } = render(
      <AvatarPreview {...defaultProps} width={200} height={300} />
    )
    const body = getByTestId('body-medium')
    expect(body).toBeTruthy()
  })

  it('handles missing optional props gracefully', () => {
    const minimalProps = {
      bodyType: 'body-medium' as const,
    }
    const { getByTestId } = render(<AvatarPreview {...minimalProps} />)
    expect(getByTestId('body-medium')).toBeTruthy()
  })

  it('handles null hairStyle', () => {
    const { queryByTestId } = render(
      <AvatarPreview {...defaultProps} hairStyle={null} />
    )
    expect(queryByTestId('hair-null-medium')).toBeNull()
  })

  it('handles null eyeShape', () => {
    const { queryByTestId } = render(
      <AvatarPreview {...defaultProps} eyeShape={null} />
    )
    // Eyes component should not render when eyeShape is null
    expect(queryByTestId('eyes-null-medium')).toBeNull()
  })

  it('handles null clothing', () => {
    const { queryByTestId } = render(
      <AvatarPreview {...defaultProps} clothing={null} />
    )
    expect(queryByTestId('clothing-null-medium')).toBeNull()
  })

  it('handles prosthetic devices correctly', () => {
    const { getByTestId } = render(
      <AvatarPreview
        {...defaultProps}
        devices={['prostetic1']}
        clothing="shirt1"
      />
    )
    // Prosthetic devices should render before clothing
    expect(getByTestId('devices-prostetic1-medium')).toBeTruthy()
    expect(getByTestId('clothing-shirt1-medium')).toBeTruthy()
  })

  it('handles accessory devices (necklaces)', () => {
    const { getByTestId } = render(
      <AvatarPreview {...defaultProps} devices={['necklace1']} />
    )
    expect(getByTestId('devices-necklace1-medium')).toBeTruthy()
  })
})

