import React from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'
import { useColor } from '../hooks/useColor'

export const Hr = ({ style, ...props }: ViewProps) => {
  const { borderColor } = useColor()

  return <View style={[styles.hr, { backgroundColor: borderColor }, style]} {...props} />
}

const styles = StyleSheet.create({
  hr: {
    width: '100%',
    height: 1,
  },
})
