import React from 'react'
import { StyleSheet, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Button } from '../../../components/Button'
import { useAuthMode } from '../AuthModeContext'
import { useDispatch } from 'react-redux'
import { useSelector } from '../../../redux/useSelector'
import { currentUserSelector } from '../../../redux/selectors'
import { logoutRequest } from '../../../redux/actions'
import { Text } from '../../../components/Text'
import { useColor } from '../../../hooks/useColor'

export const AuthHeader = ({ title }: { title: string }) => {
  const user = useSelector(currentUserSelector)
  const dispatch = useDispatch()
  const { setAuthMode } = useAuthMode()
  const { palette } = useColor()

  const onClose = () => {
    if (user) {
      dispatch(logoutRequest())
    }

    setAuthMode('start')
  }

  return (
    <View style={[styles.header, { backgroundColor: palette.danger.base }]}>
      <View style={styles.closeButton}>{/* Spacer */}</View>
      <Text style={styles.title}>{title}</Text>
      <Button onPress={onClose} style={styles.closeButton} status="danger_light">
        <FontAwesome size={16} name={'close'} color={'#fff'} />
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    height: 80,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    width: 24,
    height: 24,
    margin: 24,
  },
})
