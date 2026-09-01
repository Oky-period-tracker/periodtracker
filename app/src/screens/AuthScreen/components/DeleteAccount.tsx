import React from 'react'
import { Alert, StyleSheet, TouchableOpacity } from 'react-native'
import { AuthHeader } from './AuthHeader'
import { AuthCardBody } from './AuthCardBody'
import { Hr } from '../../../components/Hr'
import { Input } from '../../../components/Input'
import { Text } from '../../../components/Text'
import { formatPassword } from '../../../services/auth'
import { deleteAccountFromLogin } from '../../../services/auth/accountFlows'
import { useTranslate } from '../../../hooks/useTranslate'
import { useAuthMode } from '../AuthModeContext'
import { analytics } from '../../../services/firebase'

export const DeleteAccount = () => {
  const { setAuthMode } = useAuthMode()
  const translate = useTranslate()
  const [name, setName] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [errorsVisible, setErrorsVisible] = React.useState(false)
  const errors = [!name && 'username_too_short', !password && 'password_too_short'].filter(
    Boolean,
  ) as string[]

  const onConfirm = async () => {
    if (errors.length) {
      setErrorsVisible(true)
      return
    }
    try {
      await deleteAccountFromLogin(name, formatPassword(password))
      analytics?.().logEvent('deleteAccount')
      Alert.alert(translate('delete_account_completed'))
      setAuthMode('start')
    } catch {
      Alert.alert(translate('delete_account_fail'))
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
      <TouchableOpacity style={styles.confirm} onPress={onConfirm}>
        <Text style={styles.confirmText}>confirm_and_delete</Text>
      </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
  confirm: { padding: 24 },
  confirmText: { textAlign: 'center', fontWeight: 'bold' },
})
