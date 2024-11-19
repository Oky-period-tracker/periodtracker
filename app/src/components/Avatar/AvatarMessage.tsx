import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Text } from '../Text'
import { useAvatarMessage } from '../../contexts/AvatarMessageContext'
import { useTutorial } from '../../screens/MainScreen/TutorialContext'
import { globalStyles } from '../../config/theme'
import { useColor } from '../../hooks/useColor'

export const AvatarMessage = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const { message } = useAvatarMessage()
  const { state } = useTutorial()
  const { backgroundColor } = useColor()

  if (!message || state.isPlaying) {
    return null
  }

  return (
    <View style={[styles.container, { backgroundColor }, globalStyles.shadow, style]}>
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
    top: 80,
    left: 120,
    borderRadius: 20,
    width: 160,
    minHeight: 60,
    padding: 12,
    zIndex: 99999,
  },
  triangle: {
    borderTopWidth: 20,
    borderRightWidth: 16,
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    position: 'absolute',
    left: 16,
    bottom: -20,
  },
})
