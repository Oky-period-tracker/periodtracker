import React from 'react'
import { TouchableOpacity, Image, StyleSheet } from 'react-native'
import { assets } from '../../../assets/index'
import { isTablet } from 'react-native-device-info'

const defaultSize = isTablet() ? 32 : 20

export const IconButton = ({
  name,
  onPress,
  width = defaultSize,
  height = defaultSize,
  touchableStyle = null,
  disabled = false,
  ...props
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[styles.default, touchableStyle]}
      onPress={onPress}
    >
      <Image source={assets.static.icons[name]} style={{ width, height }} {...props} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  default: {
    zIndex: 999,
  },
})
