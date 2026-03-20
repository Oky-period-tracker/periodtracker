import React from 'react'
import { FontAwesome } from '@expo/vector-icons'

import { Button } from '../../../components/Button'
import { StyleSheet } from 'react-native'
import { useTutorial } from '../TutorialContext'
import { useAccessibilityLabel } from '../../../hooks/useAccessibilityLabel'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export const TutorialSkip = () => {
  const { dispatch, steps } = useTutorial()
  const getAccessibilityLabel = useAccessibilityLabel()
  const label = getAccessibilityLabel('close')
  const insets = useSafeAreaInsets()

  const onSkip = () => {
    dispatch({ type: 'skip', value: steps.length })
  }

  return (
    <Button style={[styles.button, { top: insets.top + 12 }]} status={'basic'} onPress={onSkip}>
      <FontAwesome name="close" size={24} color="white" accessibilityLabel={label} />
    </Button>
  )
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 24,
    width: 32,
    height: 32,
    zIndex: 9999,
  },
})
