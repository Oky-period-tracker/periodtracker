import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Text } from '../Text'
import { useAvatarMessage } from '../../contexts/AvatarMessageContext'
import { useTutorial } from '../../screens/MainScreen/TutorialContext'
import { globalStyles } from '../../config/theme'
import { useColor } from '../../hooks/useColor'
import { useResponsive } from '../../contexts/ResponsiveContext'

// Dimensions and styling for the speech bubble that appears above the avatar
const MESSAGE_BUBBLE_CONFIG = {
  width: 135,
  minHeight: 50,
  padding: 10,
  borderRadius: 20,
  zIndex: 10,
} as const

// Dimensions for the small triangular pointer at the bottom of the bubble,
// created using the CSS border trick (only one border is colored, the others
// are transparent, forming a triangle shape pointing down toward the avatar)
const TRIANGLE_CONFIG = {
  borderTopWidth: 20,
  borderRightWidth: 16,
  left: 16,
  bottom: -20, // Positioned just below the bubble container
} as const

// Returns the vertical offset of the bubble relative to its parent,
// adjusted per screen-width breakpoint so the bubble stays visually
// aligned with the avatar across different device sizes
const getMessageTopPosition = (screenWidth: number): number => {
  if (screenWidth <= 360) return -12
  if (screenWidth <= 392) return -14
  if (screenWidth <= 411) return 2
  if (screenWidth <= 480) return 25
  if (screenWidth <= 600) return 0
  if (screenWidth <= 720) return -2
  return -5
}

// Returns the horizontal offset of the bubble, increasing with screen
// width so the bubble stays positioned to the right of the avatar
const getMessageLeftPosition = (screenWidth: number): number => {
  if (screenWidth <= 360) return 42
  if (screenWidth <= 392) return 50
  if (screenWidth <= 411) return 82
  if (screenWidth <= 480) return 100
  if (screenWidth <= 600) return 112
  if (screenWidth <= 720) return 122
  return 132
}

/**
 * Displays a speech-bubble message next to the avatar.
 * The bubble is absolutely positioned relative to its parent, with
 * responsive offsets so it aligns correctly on all screen sizes.
 *
 * It is hidden when there is no message to show or when the tutorial
 * is playing (to avoid visual clutter during the tutorial flow).
 */
export const AvatarMessage = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const { message } = useAvatarMessage() // Current message text to display (or null)
  const { state } = useTutorial() // Tutorial state — used to hide bubble during tutorial
  const { backgroundColor } = useColor() // Theme-aware background color for the bubble
  const { width } = useResponsive() // Current screen width for responsive positioning

  // Don't render anything if there's no message, or during the tutorial
  if (!message || state.isPlaying) {
    return null
  }

  const topPosition = getMessageTopPosition(width)
  const leftPosition = getMessageLeftPosition(width)

  return (
    <View
      pointerEvents="none"
      style={[
        styles.container,
        { backgroundColor, top: topPosition, left: leftPosition, width: width <= 392 ? 135 : MESSAGE_BUBBLE_CONFIG.width, padding: width <= 392 ? 6 : MESSAGE_BUBBLE_CONFIG.padding },
        globalStyles.shadow,
        style,
      ]}
    >
      <Text enableTranslate={false} accessibilityLabel={message} style={styles.messageText} numberOfLines={3}>
        {message}
      </Text>
      {/* Triangle pointer — colored to match the bubble background */}
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
  messageText: {
    fontSize: 12,
  },
  // CSS border trick to draw a downward-pointing triangle
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
