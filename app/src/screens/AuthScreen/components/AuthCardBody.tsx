import React from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'

export const AuthCardBody = ({ style, children, ...props }: ViewProps) => {
  return (
    <View style={[styles.container, style]} {...props}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
    padding: 24,
    paddingVertical: 32,
  },
})
