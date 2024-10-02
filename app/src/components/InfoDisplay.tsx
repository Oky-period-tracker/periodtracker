import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from './Text'
import { globalStyles } from '../config/theme'
import { useColor } from '../hooks/useColor'

export const InfoDisplay = ({
  content,
}: {
  content: Array<{
    type: 'HEADING' | 'CONTENT'
    content: string
  }>
}) => {
  const { backgroundColor } = useColor()

  return (
    <View style={[styles.container, { backgroundColor }, globalStyles.shadow]}>
      {content.map((item, i) => (
        <Text
          key={`info-${i}`}
          style={[styles.text, item.type === 'HEADING' && styles.heading]}
          enableTranslate={false}
        >
          {item.content}
        </Text>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    borderRadius: 20,
    marginTop: 4,
    marginBottom: 80,
    padding: 24,
  },
  text: {
    marginBottom: 8,
  },
  heading: {
    fontSize: 16,
    fontWeight: 'bold',
  },
})
