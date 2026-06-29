import React from 'react'
import { StyleSheet, View } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Button } from '../../../components/Button'
import { useAuthMode } from '../AuthModeContext'
import { logoutToAnon } from '../../../services/auth/accountFlows'
import { Text } from '../../../components/Text'
import { useColor } from '../../../hooks/useColor'

export const AuthHeader = ({ title }: { title: string }) => {
  const { setAuthMode } = useAuthMode()
  const { palette } = useColor()

  // Return to the account-selection / login-signup start screen in a genuinely logged-out state.
  // Switching to the anon store clears the loaded account, so the login form is empty/editable
  // (its name field is locked while an account is loaded) and the switcher lists every account.
  // setAuthMode('start') is synchronous insurance for the case where the store switch is a no-op
  // (already anon) and so does not remount the screen.
  const onClose = () => {
    void logoutToAnon()
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
