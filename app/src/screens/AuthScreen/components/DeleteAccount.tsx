import React from 'react'
import { StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { AuthHeader } from './AuthHeader'
import { Hr } from '../../../components/Hr'
import { Input } from '../../../components/Input'
import { Text } from '../../../components/Text'
import { formatPassword } from '../../../services/auth'
import { AuthCardBody } from './AuthCardBody'
import { useDispatch } from 'react-redux'
import { deleteAccountRequest } from '../../../redux/actions'
import { useTranslate } from '../../../hooks/useTranslate'

export const DeleteAccount = () => {
  const dispatch = useDispatch()
  const translate = useTranslate()

  const [name, setName] = React.useState('')
  const [password, setPassword] = React.useState('')

  const [errorsVisible, setErrorsVisible] = React.useState(false)
  const { errors } = validateCredentials(name, password)

  const onConfirm = () => {
    if (errors.length) {
      setErrorsVisible(true)
      return
    }

    // Show confirmation dialog before deleting
    Alert.alert(
      translate('are_you_sure'),
      translate('delete_account_description'),
      [
        {
          text: translate('cancel'),
          style: 'cancel',
        },
        {
          text: translate('yes'),
          onPress: () => {
            // Route all deletions through the Redux saga.
            // The saga handles: server deletion (if online), SQLite deletion, success/error alerts and navigation.
            dispatch(deleteAccountRequest({ name, password: formatPassword(password) }))
          },
        },
      ],
      { cancelable: false },
    )
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
