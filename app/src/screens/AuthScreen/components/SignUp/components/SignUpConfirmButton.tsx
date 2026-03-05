import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { useSignUp } from '../SignUpContext'
import { Text } from '../../../../../components/Text'

export const SignUpConfirmButton = () => {
  const { continueSignUp, state } = useSignUp()

  const onPress = () => continueSignUp()

  return (
    <TouchableOpacity onPress={onPress} style={styles.confirm} disabled={state.isCheckingUsername}>
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
