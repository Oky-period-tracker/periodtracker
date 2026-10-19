import React from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export const Screen = ({ children, style, ...props }: ViewProps) => {
  return (
    <View style={styles.wrapper}>
      <View style={[styles.screen, style]} {...props}>
        {children}
      </View>
    </View>
  )
}

export const SafeScreen = ({ children, style, ...props }: ViewProps) => {
  return (
    <View style={styles.wrapper}>
      <SafeAreaView style={[styles.screen, style]} {...props}>
        {children}
      </SafeAreaView>
    </View>
  )
}

export const FullScreen = ({ children, style, ...props }: ViewProps) => {
  return (
    <SafeAreaView style={[styles.full, style]} {...props}>
      {children}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  screen: {
    flex: 1,
    width: '100%',
    maxWidth: 800,
    alignItems: 'center',
  },
  full: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
})
