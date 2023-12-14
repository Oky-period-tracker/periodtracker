import React from 'react'
import { TouchableOpacity, Image, ImageProps, TouchableOpacityProps } from 'react-native'
import { assets } from '../../../assets'

type Props = Omit<ImageProps, 'source'> & {
  name: string
  onPress: () => void
  width?: number
  height?: number
  touchableStyle?: TouchableOpacityProps['style']
  disabled?: boolean
}

export const IconButton = ({
  name,
  onPress,
  width = 20,
  height = 20,
  touchableStyle = null,
  disabled = false,
  ...props
}: Props) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[touchableStyle, { zIndex: 999 }]}
      onPress={onPress}
    >
      <Image source={assets.static.icons[name]} style={{ width, height }} {...props} />
    </TouchableOpacity>
  )
}
