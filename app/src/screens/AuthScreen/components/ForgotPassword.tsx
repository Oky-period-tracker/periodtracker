import React from 'react'
import { Alert, StyleSheet, TouchableOpacity } from 'react-native'
import { AuthHeader } from './AuthHeader'
import { Hr } from '../../../components/Hr'
import { Input } from '../../../components/Input'
import { Text } from '../../../components/Text'
import { httpClient } from '../../../services/HttpClient'
import {
  changeLocalPassword,
  commitAltPassword,
  deleteAltPassword,
  formatPassword,
  localLogin,
} from '../../../services/auth'
import { useTranslate } from '../../../hooks/useTranslate'
import { useAuthMode } from '../AuthModeContext'
import { getUserIdFromName } from '../../../services/encryption'
import { AuthCardBody } from './AuthCardBody'

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

  const successAlert = () => {
    Alert.alert(
      translate('success'),
      translate('forgot_password_completed'),
      [
        {
          text: translate('continue'),
          onPress: () => {
            // TODO: log in the user instead?
            setAuthMode('start')
          },
        },
      ],
      { cancelable: false },
    )
  }

  const failAlert = () => {
    Alert.alert(
      translate('unsuccessful'),
      translate('password_change_fail_description'),
      [
        {
          text: translate('continue'),
        },
      ],
      { cancelable: false },
    )
  }

  const onConfirm = async () => {
    if (errors.length) {
      setErrorsVisible(true)
      return
    }

    const existsLocally = await getUserIdFromName(name)

    const { localUserId, DEK } = await localLogin({
      name,
      password: formatPassword(answer),
      isAnswer: true,
    })

    if (existsLocally && (!DEK || !localUserId)) {
      // Exists locally but authentication failed
      return false
    }

    const formattedAnswer = formatPassword(answer)
    const formattedPassword = formatPassword(password)

    if (localUserId && DEK) {
      const altPasswordSaved = await changeLocalPassword(
        localUserId,
        formattedAnswer,
        formattedPassword,
        true,
      )

      if (!altPasswordSaved) {
        return false
      }
    }

    try {
      // Check exists, and compare ids
      const getUserInfoResponse = await httpClient.getUserInfo(name)
      const onlineId = getUserInfoResponse?.id
      const idsMatch = localUserId && onlineId && onlineId === localUserId
      const existsOnline = Boolean(onlineId)
      const shouldChangeOnline = existsOnline && (idsMatch || !existsLocally)

      if (shouldChangeOnline) {
        // Reset online
        await httpClient.resetPassword({
          name,
          secretAnswer: formattedAnswer,
          password: formattedPassword,
        })
      }

      // Online success (or skipped), commit change locally
      if (localUserId) {
        await commitAltPassword(localUserId)
      }
      successAlert()
    } catch (e) {
      if (localUserId) {
        // Revert back to old password
        deleteAltPassword(localUserId)
      }
      failAlert()
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
          placeholder="new_password"
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
