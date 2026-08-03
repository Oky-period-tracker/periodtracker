import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Hr } from '../../../components/Hr'
import { useAuthMode } from '../AuthModeContext'
import { Text } from '../../../components/Text'

export const AuthToggle = () => {
  const { setAuthMode } = useAuthMode()
  const onLogInPress = () => setAuthMode('log_in')
  const onSignUpPress = () => setAuthMode('sign_up')

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
        <Text style={styles.text}>sign_up</Text>
      </TouchableOpacity>

      <Hr />

      <TouchableOpacity style={styles.button} onPress={onLogInPress}>
        <Text style={styles.text}>log_in</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
  },
  button: {
    height: 100,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
})
