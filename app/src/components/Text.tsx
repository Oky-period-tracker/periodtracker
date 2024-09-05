import React from 'react'
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native'
import { PaletteStatus, palette } from '../config/theme'
import { useTranslate } from '../hooks/useTranslate'

export type CustomTextProps = RNTextProps & {
  status?: PaletteStatus
  enableTranslate?: boolean
}

export const Text: React.FC<CustomTextProps> = ({
  children,
  status = 'basic',
  style,
  enableTranslate = true,
  ...props
}) => {
  const translate = useTranslate()
  const color = palette[status].text

  const getContent = () => {
    if (enableTranslate && typeof children === 'string') {
      return translate(children)
    }
    return children
  }

  return (
    <RNText style={[styles.default, { color }, style]} {...props}>
      {getContent()}
    </RNText>
  )
}

const styles = StyleSheet.create({
  default: {
    fontSize: 14,
  },
})
