import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from '../Text'
import { useAvatarMessage } from '../../contexts/AvatarMessageContext'
import { useTutorial } from '../../screens/MainScreen/TutorialContext'
import { avatarException, globalStyles } from '../../config/theme'
import { useSelector } from 'react-redux'
import { currentAvatarSelector } from '../../redux/selectors'
import { useColor } from '../../hooks/useColor'

export const AvatarMessage = () => {
  const avatar = useSelector(currentAvatarSelector)
  const { message } = useAvatarMessage()
  const { state } = useTutorial()
  const { backgroundColor } = useColor()

  if (!message || state.isPlaying) {
    return null
  }

  let top = 80

  if (avatar === avatarException) {
    // TODO: Oky lottie different size to the rest
    top = 0
    'transparent'
  }

  return (
    <View style={[styles.container, { top, backgroundColor }, globalStyles.shadow]}>
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
