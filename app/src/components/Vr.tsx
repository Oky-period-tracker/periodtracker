import React from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'

export const Vr = ({ style, ...props }: ViewProps) => {
  return <View style={[styles.vr, style]} {...props} />
}

const styles = StyleSheet.create({
  vr: {
    height: '100%',
    width: 1,
    backgroundColor: '#f0f0f0',
  },
})
