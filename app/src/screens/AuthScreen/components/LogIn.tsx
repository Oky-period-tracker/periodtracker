import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { AuthHeader } from './AuthHeader'
import { Hr } from '../../../components/Hr'
import { Input } from '../../../components/Input'
import { ErrorText } from '../../../components/ErrorText'
import { useSelector } from '../../../redux/useSelector'
import { currentUserSelector } from '../../../redux/selectors'
import { useAuth } from '../../../contexts/AuthContext'
import { formatPassword } from '../../../services/auth'
import { useDispatch } from 'react-redux'
import { loginRequest } from '../../../redux/actions'
import { Text } from '../../../components/Text'
import { AuthCardBody } from './AuthCardBody'

export const LogIn = () => {
  const user = useSelector(currentUserSelector)
  const [wasPreLoggedIn] = React.useState(!!user)
  const dispatch = useDispatch()
  const { setIsLoggedIn } = useAuth()

  const [name, setName] = React.useState(user ? user.name : '')
  const [password, setPassword] = React.useState('')

  const [errorsVisible, setErrorsVisible] = React.useState(false)
  const { errors } = validateCredentials(name, password)

  const [success, setSuccess] = React.useState<boolean | null>(null)

  const [margin, setMargin] = React.useState(0)

  const onConfirm = () => {
    if (errors.length) {
      setErrorsVisible(true)
      return
    }

    if (user) {
      const formattedPassword = formatPassword(password)
      const success = user.password === formattedPassword

      if (success) {
        setIsLoggedIn(true)
        return
      }

      setSuccess(false)
      return
    }

    dispatch(loginRequest({ name, password: formatPassword(password) }))
  }

  React.useEffect(() => {
    if (wasPreLoggedIn || !user) {
      return
    }
    setIsLoggedIn(true)
  }, [user])

  React.useEffect(() => {
    // This is a hack to prevent the confirm button from being hidden
    setTimeout(() => {
      setMargin(1)
    }, 500)
  }, [])

  const title = wasPreLoggedIn ? 'password_request' : 'log_in'

  return (
    <>
      <AuthHeader title={title} />
      <AuthCardBody>
        <Input
          value={name}
          onChangeText={setName}
          placeholder="enter_name"
          errors={errors}
          errorKeys={['username_too_short']}
          errorsVisible={errorsVisible}
          editable={!user}
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
        {success === false && <ErrorText>password_incorrect</ErrorText>}
      </AuthCardBody>
      <Hr />
      <TouchableOpacity onPress={onConfirm} style={[styles.confirm, { marginBottom: margin }]}>
        <Text style={styles.confirmText}>confirm</Text>
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
