import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { useSignUp } from '../SignUpContext'
import { Text } from '../../../../../components/Text'

export const SignUpConfirmButton = () => {
  const { dispatch } = useSignUp()

  const onPress = () => dispatch({ type: 'continue' })

  return (
    <TouchableOpacity onPress={onPress} style={styles.confirm}>
      <Text style={styles.confirmText}>confirm</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  confirm: {
    padding: 24,
  },
  confirmText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
})
