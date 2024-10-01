import React from 'react'
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native'
import { PaletteStatus, palette } from '../config/theme'
import { useTranslate } from '../hooks/useTranslate'
import { useColor } from '../hooks/useColor'

export type CustomTextProps = RNTextProps & {
  status?: PaletteStatus
  enableTranslate?: boolean
}

export const Text: React.FC<CustomTextProps> = ({
  children,
  status,
  style,
  enableTranslate = true,
  ...props
}) => {
  let { color } = useColor()
  const translate = useTranslate()

  if (status && status !== 'basic') {
    color = palette[status].text
  }

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
