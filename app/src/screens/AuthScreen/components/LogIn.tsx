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
import { Text } from '../../../components/Text'
import { AuthCardBody } from './AuthCardBody'
import { loadPendingSyncData } from '../../../services/pendingSync'
import {
  loginToAccount,
  loginOnlineToAccount,
  MAX_ACCOUNTS,
} from '../../../services/auth/accountFlows'
import { verifyPassword } from '../../../services/auth/credentialVault'

export const LogIn = () => {
  const user = useSelector(currentUserSelector)
  const [wasPreLoggedIn] = React.useState(!!user)
  const { setIsLoggedIn } = useAuth()

  const [name, setName] = React.useState(user ? user.name : '')
  const [password, setPassword] = React.useState('')

  const [errorsVisible, setErrorsVisible] = React.useState(false)
  const { errors } = validateCredentials(name, password)

  const [success, setSuccess] = React.useState<boolean | null>(null)
  // Which error to show when success === false. Defaults to a wrong-passcode message; the online
  // login can instead fail because the device is full (MAX_ACCOUNTS), which is not a bad password.
  const [errorKey, setErrorKey] = React.useState('password_incorrect')

  const [margin, setMargin] = React.useState(0)

  // Clear a stale "incorrect" message as soon as the user edits either field.
  React.useEffect(() => {
    setSuccess(null)
    setErrorKey('password_incorrect')
  }, [name, password])

  // Pre-fill username from pending sync data after a forced logout
  React.useEffect(() => {
    if (user || name) return
    loadPendingSyncData().then((data) => {
      if (data?.editInfo?.name) {
        setName(data.editInfo.name)
      }
    })
  }, [])

  const onConfirm = async () => {
    if (errors.length) {
      setErrorsVisible(true)
      return
    }

    const formattedPassword = formatPassword(password)

    if (user) {
      // Passcode re-entry for the account already loaded into the active store. Verify against
      // the credential vault (the source of truth, kept current by offline password resets),
      // falling back to the plaintext stored on the user for any pre-vault account.
      const ok =
        (await verifyPassword(user.id, formattedPassword)) || user.password === formattedPassword
      if (ok) {
        setIsLoggedIn(true)
        return
      }
      setSuccess(false)
      return
    }

    // Fresh login: try a locally registered account first (works offline), then fall back to an
    // online login if no local account matches this name. The online path registers the account
    // and gives it its own store, so it joins the account switcher instead of landing in the
    // shared anon store.
    try {
      const loggedIn =
        (await loginToAccount(name, formattedPassword)) ||
        (await loginOnlineToAccount(name, formattedPassword))
      if (loggedIn) {
        setIsLoggedIn(true)
        return
      }
      setSuccess(false)
    } catch (err) {
      if (err instanceof Error && err.message === MAX_ACCOUNTS) {
        setErrorKey('max_accounts_reached')
      }
      setSuccess(false)
    }
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
        {success === false && <ErrorText>{errorKey}</ErrorText>}
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
