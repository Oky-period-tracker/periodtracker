import React from 'react'
import { Alert, StyleSheet, TouchableOpacity } from 'react-native'
import { AuthHeader } from './AuthHeader'
import { Hr } from '../../../components/Hr'
import { Input } from '../../../components/Input'
import { Text } from '../../../components/Text'
import { httpClient } from '../../../services/HttpClient'
import { formatPassword } from '../../../services/auth'
import { useTranslate } from '../../../hooks/useTranslate'
import { useAuthMode } from '../AuthModeContext'
import { AuthCardBody } from './AuthCardBody'
import { analytics } from '../../../services/firebase'

export const DeleteAccount = () => {
  const { setAuthMode } = useAuthMode()
  const translate = useTranslate()

  const [name, setName] = React.useState('')
  const [password, setPassword] = React.useState('')

  const [errorsVisible, setErrorsVisible] = React.useState(false)
  const { errors } = validateCredentials(name, password)

  const goBack = () => {
    setAuthMode('start')
  }

  const onConfirm = async () => {
    if (errors.length) {
      setErrorsVisible(true)
      return
    }

    try {
      // Check user exists
      await httpClient.getUserInfo(name)

      // Delete
      await httpClient.deleteUserFromPassword({
        name,
        password: formatPassword(password),
      })

      Alert.alert('success', 'delete_account_completed', [
        {
          text: translate('continue'),
          onPress: goBack,
        },
      ])

      analytics?.().logEvent('deleteAccount')
    } catch (e) {
      Alert.alert('error', 'delete_account_fail')
      setName('')
      setPassword('')
    }
  }

  return (
    <>
      <AuthHeader title={'delete_account'} />
      <AuthCardBody>
        <Input
          value={name}
          onChangeText={setName}
          placeholder="name"
          errors={errors}
          errorKeys={['username_too_short']}
          errorsVisible={errorsVisible}
        />
        <Input
          value={password}
          onChangeText={setPassword}
          placeholder="password"
          secureTextEntry={true}
          errors={errors}
          errorKeys={['password_too_short']}
          errorsVisible={errorsVisible}
        />
      </AuthCardBody>
      <Hr />
      <TouchableOpacity onPress={onConfirm} style={styles.confirm}>
        <Text style={styles.confirmText}>confirm_and_delete</Text>
      </TouchableOpacity>
    </>
  )
}

const validateCredentials = (name: string, password: string) => {
  const errors: string[] = []
  let isValid = true

  if (!name.length) {
    isValid = false
  }

  if (!password.length) {
    isValid = false
  }

  return { isValid, errors }
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
