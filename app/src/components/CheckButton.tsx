import React from 'react'
import { StyleSheet } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { ButtonProps, DisplayButton } from './Button'

export const CheckButton = ({ style, ...props }: ButtonProps) => {
  return (
    <DisplayButton style={[styles.check, style]} {...props}>
      <FontAwesome size={12} name={'check'} color={'#fff'} />
    </DisplayButton>
  )
}

const styles = StyleSheet.create({
  check: {
    height: 24,
    width: 24,
  },
})
