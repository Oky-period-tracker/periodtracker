import React from 'react'
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Hr } from '../../../components/Hr'
import { useAuthMode } from '../AuthModeContext'
import { Text } from '../../../components/Text'
import { useTranslate } from '../../../hooks/useTranslate'
import { userCount } from '../../../services/userMetadata/registry'
import {
  ENFORCE_ACCOUNT_LIMIT,
  MAX_ACCOUNTS_PER_DEVICE,
} from '../../../services/userMetadata/types'

export const AuthToggle = () => {
  const { setAuthMode } = useAuthMode()
  const translate = useTranslate()
  const onLogInPress = () => setAuthMode('log_in')
  const onSignUpPress = async () => {
    if (ENFORCE_ACCOUNT_LIMIT) {
      const count = await userCount()
      if (count >= MAX_ACCOUNTS_PER_DEVICE) {
        Alert.alert(translate('alert'), translate('max_accounts_reached'))
        return
      }
    }
    setAuthMode('sign_up')
  }

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
