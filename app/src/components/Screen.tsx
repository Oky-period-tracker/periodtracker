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
    flex: 1,
    width: '100%',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  screen: {
    flex: 1,
    width: '100%',
    maxWidth: 800,
    alignItems: 'stretch',
    alignSelf: 'center',
  },
  full: {
    flex: 1,
    width: '100%',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
  },
})
