import React from 'react'
import { StyleSheet } from 'react-native'
import { Text, CustomTextProps } from './Text'
import { useColor } from '../hooks/useColor'

export const ErrorText = ({ style, children, ...props }: CustomTextProps) => {
  const { errorColor } = useColor()
  return (
    <Text style={[styles.error, { color: errorColor }, style]} {...props}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  error: {
    fontSize: 10,
    textAlign: 'center',
  },
})
