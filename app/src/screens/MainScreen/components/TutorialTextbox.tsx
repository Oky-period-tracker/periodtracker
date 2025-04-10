import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from '../../../components/Text'
import { useTutorial } from '../TutorialContext'
import { useScreenDimensions } from '../../../hooks/useScreenDimensions'
import { globalStyles } from '../../../config/theme'
import { useColor } from '../../../hooks/useColor'

export const TutorialTextbox = () => {
  const { backgroundColor } = useColor()
  const { state, stepConfig } = useTutorial()
  const { width } = useScreenDimensions()

  if (!stepConfig || !state.isPlaying) {
    return null
  }

  const { title, text, textBoxTop } = stepConfig

  return (
    <View
      style={[
        styles.box,
        globalStyles.shadow,
        { width: width - 48, backgroundColor },
        textBoxTop ? styles.top : styles.bottom,
      ]}
    >
      <Text style={styles.title} status={'primary'}>
        {title}
      </Text>
      <Text>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    borderRadius: 20,
    padding: 12,
    justifyContent: 'center',
  },
  top: {
    top: 12,
    bottom: undefined,
  },
  bottom: {
    bottom: 12,
    top: undefined,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
})
