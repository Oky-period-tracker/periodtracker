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
import useAlert from '../../../hooks/useAlert.ts'

export const ForgotPassword = () => {
  const translate = useTranslate()
  const [name, setName] = React.useState('')
  const [answer, setAnswer] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [passwordConfirm, setPasswordConfirm] = React.useState('')
  const { setAuthMode } = useAuthMode()

  const [errorsVisible, setErrorsVisible] = React.useState(false)

  const { errors } = validateCredentials({
    name,
    answer,
    password,
    passwordConfirm,
  })

  const { successAlert , failAlert } = useAlert();

  const onConfirm = async () => {
    if (errors.length) {
      setErrorsVisible(true)
      return
    }

    try {
      // Check exists
      await httpClient.getUserInfo(name)

      // Reset
      await httpClient.resetPassword({
        name,
        secretAnswer: formatPassword(answer),
        password: formatPassword(password),
      })

      successAlert('success','forgot_password_completed',()=>{
      // TODO: log in the user instead?
        setAuthMode('start');
      })
    } catch (e) {
      failAlert('password_change_fail','password_change_fail_description')
    }

    // Reset
    setName('')
    setAnswer('')
    setPassword('')
    setPasswordConfirm('')
    setErrorsVisible(false)
  }

  return (
    <>
      <AuthHeader title={'forgot_password'} />
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
          value={answer}
          onChangeText={setAnswer}
          placeholder="secret_answer"
          errors={errors}
          errorKeys={['secret_too_short']}
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
        <Input
          value={passwordConfirm}
          onChangeText={setPasswordConfirm}
          placeholder="confirm_password"
          secureTextEntry={true}
          errors={errors}
          errorKeys={['passcodes_mismatch']}
          errorsVisible={errorsVisible}
        />
      </AuthCardBody>
      <Hr />
      <TouchableOpacity onPress={onConfirm} style={styles.confirm}>
        <Text style={styles.confirmText}>confirm</Text>
      </TouchableOpacity>
    </>
  )
}

const validateCredentials = ({
  name,
  answer,
  password,
  passwordConfirm,
}: {
  name: string
  answer: string
  password: string
  passwordConfirm: string
}) => {
  const errors: string[] = []
  let isValid = true

  if (name.length < 3) {
    isValid = false
    errors.push('username_too_short')
  }

  if (answer.length < 1) {
    isValid = false
    errors.push('secret_too_short')
  }

  if (password.length < 3) {
    isValid = false
    errors.push('password_too_short')
  }

  if (password !== passwordConfirm) {
    isValid = false
    errors.push('passcodes_mismatch')
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
