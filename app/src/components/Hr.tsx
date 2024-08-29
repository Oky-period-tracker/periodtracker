import React from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'

export const Hr = ({ style, ...props }: ViewProps) => {
  return <View style={[styles.hr, style]} {...props} />
}

const styles = StyleSheet.create({
  hr: {
    width: '100%',
    height: 1,
    backgroundColor: '#f0f0f0',
  },
})
