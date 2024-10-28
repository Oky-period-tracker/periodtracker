import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { AuthHeader } from './AuthHeader'
import { Hr } from '../../../components/Hr'
import { Input } from '../../../components/Input'
import { ErrorText } from '../../../components/ErrorText'
import { useSelector } from '../../../redux/useSelector'
import {
  lastLoggedInUsernameSelector,
  legacyPrivateStateSelector,
  legacyUserSelector,
} from '../../../redux/selectors'
import { useAuth } from '../../../contexts/AuthContext'
import { formatPassword, initialiseLocalAccount, useLogin } from '../../../services/auth'
import { Text } from '../../../components/Text'
import { AuthCardBody } from './AuthCardBody'
import { useDispatch } from 'react-redux'
import { migratePrivateStore, setLastLoggedInUsername } from '../../../redux/actions'

export const LogIn = () => {
  const legacyUser = useSelector(legacyUserSelector)
  const legacyPrivateState = useSelector(legacyPrivateStateSelector)
  const lastLoggedInUsername = useSelector(lastLoggedInUsernameSelector)
  const dispatch = useDispatch()

  const { setIsLoggedIn } = useAuth()
  const login = useLogin()

  const [name, setName] = React.useState(lastLoggedInUsername ?? '')
  const [password, setPassword] = React.useState('')

  const [errorsVisible, setErrorsVisible] = React.useState(false)
  const { errors } = validateCredentials(name, password)

  const [success, setSuccess] = React.useState<boolean | null>(null)

  const onConfirm = async () => {
    if (errors.length) {
      setErrorsVisible(true)
      return
    }

    if (legacyUser && !legacyUser?.metadata?.hasMigrated) {
      loginLegacyUser()
      return
    }

    const loginSuccess = await login(name, formatPassword(password))
    setSuccess(loginSuccess)
  }

  const loginLegacyUser = async () => {
    if (!legacyUser) {
      return
    }

    const formattedPassword = formatPassword(password)
    const success = legacyUser.password === formattedPassword

    if (!success) {
      setSuccess(false)
      return
    }

    const initialized = await initialiseLocalAccount(
      legacyUser.name,
      legacyUser.password,
      legacyUser.id,
      legacyUser.secretAnswer,
    )

    const loginSuccess = await login(name, formatPassword(password))

    if (!initialized || !loginSuccess) {
      return // ERROR
    }

    // TODO: What if something goes wrong here and theres no user data carried across, should initialise user ?
    if (legacyPrivateState) {
      dispatch(migratePrivateStore(legacyPrivateState))
    }

    setIsLoggedIn(true)
  }

  React.useEffect(() => {
    if (!legacyUser || lastLoggedInUsername) {
      return
    }

    dispatch(setLastLoggedInUsername(legacyUser.name))
  }, [legacyUser, lastLoggedInUsername])

  const title = lastLoggedInUsername ? 'password_request' : 'log_in'

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
          editable={!lastLoggedInUsername}
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
      <TouchableOpacity onPress={onConfirm} style={styles.confirm}>
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
