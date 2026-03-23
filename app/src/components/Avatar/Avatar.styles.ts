import { ViewStyle } from 'react-native'

export const getAvatarContainerStyle = (lottieWidth: number, containerHeight: number, marginTop: number): ViewStyle => ({
  width: lottieWidth,
  height: containerHeight,
  marginTop,
})

export const getAvatarContainerBottomStyle = (bottomOffset: number): ViewStyle => ({
  bottom: bottomOffset,
})

export const getCustomAvatarScaleStyle = (scale: number): ViewStyle => ({
  transform: [{ scale }],
})

export const getLottieViewStyle = (width: number, height: number): ViewStyle => ({
  width,
  height,
})

