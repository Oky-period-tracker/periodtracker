import React from 'react'
import { StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { DisplayButton } from '../../../components/Button'
import { useTutorial } from '../TutorialContext'

export const TutorialArrow = () => {
  const { state, step, translateArrowStyle, rotateArrowStyle } = useTutorial()

  if (!step || !state.isPlaying) {
    return null
  }

  return (
    <Animated.View style={[styles.arrowButtonContainer, translateArrowStyle]}>
      <DisplayButton style={styles.arrowButton}>
        <Animated.View style={rotateArrowStyle}>
          <FontAwesome size={40} name={'arrow-left'} color={'#fff'} />
        </Animated.View>
      </DisplayButton>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  arrowButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  arrowButton: {
    width: 60,
    height: 60,
  },
})
