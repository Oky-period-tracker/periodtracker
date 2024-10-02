import React from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'
import { useColor } from '../hooks/useColor'

export const Vr = ({ style, ...props }: ViewProps) => {
  const { borderColor } = useColor()
  return <View style={[styles.vr, { backgroundColor: borderColor }, style]} {...props} />
}

const styles = StyleSheet.create({
  vr: {
    height: '100%',
    width: 1,
  },
})
