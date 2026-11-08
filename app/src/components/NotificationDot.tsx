import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useColor } from '../hooks/useColor'

// Small dot telling a user that something is waiting for them, e.g. a period reminder.
export const NotificationDot = ({
  style,
  accessibilityLabel,
}: {
  style?: StyleProp<ViewStyle>
  accessibilityLabel?: string
}) => {
  const { palette } = useColor()

  return (
    <View
      style={[styles.dot, { backgroundColor: palette.danger.base }, style]}
      accessible={!!accessibilityLabel}
      accessibilityLabel={accessibilityLabel}
    />
  )
}

const styles = StyleSheet.create({
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
})
