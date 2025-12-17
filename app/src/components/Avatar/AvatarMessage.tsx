import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Text } from '../Text'
import { useAvatarMessage } from '../../contexts/AvatarMessageContext'
import { useTutorial } from '../../screens/MainScreen/TutorialContext'
import { globalStyles } from '../../config/theme'
import { useColor } from '../../hooks/useColor'
import { useResponsive } from '../../contexts/ResponsiveContext'

const MESSAGE_BUBBLE_CONFIG = {
  width: 160,
  minHeight: 60,
  padding: 12,
  borderRadius: 20,
  zIndex: 99999,
} as const

const TRIANGLE_CONFIG = {
  borderTopWidth: 20,
  borderRightWidth: 16,
  left: 16,
  bottom: -20,
} as const

const getMessageTopPosition = (screenWidth: number): number => {
  if (screenWidth <= 360) return -10
  if (screenWidth <= 392) return -12
  if (screenWidth <= 411) return -12
  if (screenWidth <= 480) return 20
  if (screenWidth <= 600) return -18
  if (screenWidth <= 720) return -20
  return -22
}

const getMessageLeftPosition = (screenWidth: number): number => {
  if (screenWidth <= 360) return 50
  if (screenWidth <= 392) return 60
  if (screenWidth <= 411) return 70
  if (screenWidth <= 480) return 90
  if (screenWidth <= 600) return 100
  if (screenWidth <= 720) return 110
  return 120
}

export const AvatarMessage = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const { message } = useAvatarMessage()
  const { state } = useTutorial()
  const { backgroundColor } = useColor()
  const { width } = useResponsive()

  if (!message || state.isPlaying) {
    return null
  }

  const topPosition = getMessageTopPosition(width)
  const leftPosition = getMessageLeftPosition(width)

  return (
    <View
      style={[
        styles.container,
        { backgroundColor, top: topPosition, left: leftPosition },
        globalStyles.shadow,
        style,
      ]}
    >
      <Text enableTranslate={false} accessibilityLabel={message}>
        {message}
      </Text>
      <View style={[styles.triangle, { borderTopColor: backgroundColor }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    borderRadius: MESSAGE_BUBBLE_CONFIG.borderRadius,
    width: MESSAGE_BUBBLE_CONFIG.width,
    minHeight: MESSAGE_BUBBLE_CONFIG.minHeight,
    padding: MESSAGE_BUBBLE_CONFIG.padding,
    zIndex: MESSAGE_BUBBLE_CONFIG.zIndex,
  },
  triangle: {
    borderTopWidth: TRIANGLE_CONFIG.borderTopWidth,
    borderRightWidth: TRIANGLE_CONFIG.borderRightWidth,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    position: 'absolute',
    left: TRIANGLE_CONFIG.left,
    bottom: TRIANGLE_CONFIG.bottom,
  },
})
