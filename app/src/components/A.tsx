import React from 'react'
import { Platform, StyleProp, StyleSheet, TextProps, TextStyle } from 'react-native'
import * as Linking from 'expo-linking'
import { Text } from './Text'

export const A = ({
  href,
  onPress,
  style,
  enableTranslate = false,
  ...props
}: TextProps & {
  href?: string
  onPress?: () => void
  textStyle?: StyleProp<TextStyle>
  enableTranslate?: boolean
}) => {
  const onPressLink = () => {
    if (href) {
      openURL(href)
      return
    }

    if (onPress) {
      onPress()
      return
    }
  }

  return (
    <Text
      onPress={onPressLink}
      style={[styles.text, style]}
      enableTranslate={enableTranslate}
      {...props}
    />
  )
}

const openURL = (href: string, target = '_blank') => {
  let url = href
  if (!url.includes('https://')) {
    url = `https://${url}`
  }

  if (Platform.OS === 'web') {
    window.open(url, target)
    return
  }

  Linking.openURL(url)
}

const styles = StyleSheet.create({
  text: {
    color: '#28b9cb',
  },
})
