import React from 'react'
import { useDispatch } from 'react-redux'
import { Button } from '../../../components/Button'
import { convertGuestAccount } from '../../../redux/actions'
import { useSelector } from '../../../redux/useSelector'
import {
  authError,
  connectAccountAttemptsSelector,
  currentUserSelector,
} from '../../../redux/selectors'
import { ErrorText } from '../../../components/ErrorText'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useToggle } from '../../../hooks/useToggle'
import { Modal } from '../../../components/Modal'
import { Text } from '../../../components/Text'
import { Input } from '../../../components/Input'
import { Hr } from '../../../components/Hr'
import { useColor } from '../../../hooks/useColor'
import { formatPassword } from '../../../services/auth'

export const SaveAccountButton = () => {
  const currentUser = useSelector(currentUserSelector)
  const connectAccountCount = useSelector(connectAccountAttemptsSelector)
  const errorCode = useSelector(authError)
  const dispatch = useDispatch()

  const [pressed, setPressed] = React.useState(false)
  const [error, setError] = React.useState(false)

  const [visible, toggleVisible] = useToggle()
  const [password, setPassword] = React.useState('')
  const [answer, setAnswer] = React.useState('')
  const { backgroundColor } = useColor()

  const onConfirm = () => {
    setPressed(true)

    if (!currentUser) {
      return
    }

    dispatch(
      convertGuestAccount({
        ...currentUser,
        password: formatPassword(password),
        secretAnswer: formatPassword(password),
      }),
    )
  }

  // Display error
  React.useEffect(() => {
    if (!pressed) {
      return
    }

    const timeout = setTimeout(() => {
      setError(true)
    }, 2000)

    return () => {
      clearTimeout(timeout)
    }
  }, [connectAccountCount, error, errorCode])

  // Hide error
  React.useEffect(() => {
    if (!error) {
      return
    }

    const timeout = setTimeout(() => {
      setError(false)
      setPressed(false)
    }, 10000)

    return () => {
      clearTimeout(timeout)
    }
  }, [error, currentUser?.name])

  return (
    <View style={styles.wrapper}>
      <Button onPress={toggleVisible} style={styles.button}>
        connect_account
      </Button>
      {error && (
        <ErrorText style={styles.error}>
          {errorCode === 409 ? 'error_same_name' : 'error_connect_guest'}
        </ErrorText>
      )}

      <Modal
        visible={visible}
        toggleVisible={toggleVisible}
        style={[styles.modal, { backgroundColor }]}
      >
        <View style={styles.modalBody}>
          <Text style={styles.title}>connect_account</Text>
          <Input
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            placeholder="password"
          />
          <Input
            value={answer}
            onChangeText={setAnswer}
            secureTextEntry={true}
            placeholder="secret_answer"
          />
        </View>

        <Hr />
        <TouchableOpacity onPress={onConfirm} style={styles.modalConfirm}>
          <Text style={styles.modalConfirmText}>confirm</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    width: 140,
  },
  error: {
    marginTop: 12,
  },
  modal: {
    borderRadius: 20,
  },
  modalBody: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalConfirm: {
    padding: 24,
  },
  modalConfirmText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
})
