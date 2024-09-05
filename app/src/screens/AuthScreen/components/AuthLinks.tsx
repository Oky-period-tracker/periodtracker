import React from 'react'
import { StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useAuthMode } from '../AuthModeContext'
import { Text } from '../../../components/Text'

export const AuthLinks = () => {
  const { setAuthMode } = useAuthMode()

  const goToForgot = () => {
    setAuthMode('forgot_password')
  }

  const goToDelete = () => {
    setAuthMode('delete_account')
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goToForgot} style={styles.link}>
        <Text style={styles.text}>forgot_password</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToDelete} style={styles.link}>
        <Text style={styles.text}>delete_account</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 12,
  },
  link: {
    marginBottom: 4,
  },
  text: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
})
