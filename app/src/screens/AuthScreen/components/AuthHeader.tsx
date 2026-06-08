import React from 'react'
import { StyleSheet, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Button } from '../../../components/Button'
import { useAuthMode } from '../AuthModeContext'
import { useSelector } from '../../../redux/useSelector'
import { currentUserSelector } from '../../../redux/selectors'
import { logoutToAnon } from '../../../services/auth/accountFlows'
import { Text } from '../../../components/Text'
import { useColor } from '../../../hooks/useColor'

export const AuthHeader = ({ title }: { title: string }) => {
  const user = useSelector(currentUserSelector)
  const { setAuthMode } = useAuthMode()
  const { palette } = useColor()

  const onClose = () => {
    if (user) {
      // Leave this account for the logged-out (anon) context without wiping its saved data.
      void logoutToAnon()
      return
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
