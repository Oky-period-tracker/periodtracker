import React from 'react'
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native'
import { useTranslate } from '../hooks/useTranslate'
import { PaletteStatus, useColor } from '../hooks/useColor'

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
  const translate = useTranslate()
  const { color, palette } = useColor()
  let textColor = color

  if (status && status !== 'basic') {
    textColor = palette[status].text
  }

  const getContent = () => {
    if (enableTranslate && typeof children === 'string') {
      return translate(children)
    }
    return children
  }

  return (
    <RNText style={[styles.default, { color: textColor }, style]} {...props}>
      {getContent()}
    </RNText>
  )
}

const styles = StyleSheet.create({
  default: {
    fontSize: 14,
  },
})
