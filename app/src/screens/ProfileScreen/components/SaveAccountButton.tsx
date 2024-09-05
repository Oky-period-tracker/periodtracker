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
import { StyleSheet, View } from 'react-native'

export const SaveAccountButton = () => {
  const currentUser = useSelector(currentUserSelector)
  const connectAccountCount = useSelector(connectAccountAttemptsSelector)
  const errorCode = useSelector(authError)
  const dispatch = useDispatch()

  const [pressed, setPressed] = React.useState(false)
  const [error, setError] = React.useState(false)

  const onPress = () => {
    setPressed(true)

    if (!currentUser) {
      return
    }

    dispatch(convertGuestAccount(currentUser))
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
      <Button onPress={onPress} style={styles.button}>
        connect_account
      </Button>
      {error && (
        <ErrorText style={styles.error}>
          {errorCode === 409 ? 'error_same_name' : 'error_connect_guest'}
        </ErrorText>
      )}
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
})
