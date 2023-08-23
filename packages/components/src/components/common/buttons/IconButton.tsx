import React from 'react'
import { TouchableOpacity, Image } from 'react-native'
import { assets } from '../../../assets/index'

export const IconButton = ({
  name,
  onPress,
  width = 20,
  height = 20,
  touchableStyle = null,
  disabled = false,
  ...props
}) => {
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
