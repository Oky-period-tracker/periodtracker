import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useAuthMode } from '../AuthModeContext'
import { Text } from '../../../components/Text'
import { NotificationDot } from '../../../components/NotificationDot'
import { useTranslate } from '../../../hooks/useTranslate'
import { useUsersWithPeriodReminders } from '../../../hooks/useUsersWithPeriodReminders'

export const AuthLinks = () => {
  const { setAuthMode } = useAuthMode()
  const translate = useTranslate()
  const usersWithReminders = useUsersWithPeriodReminders()

  const goToForgot = () => {
    setAuthMode('forgot_password')
  }
  const goToDelete = () => {
    setAuthMode('delete_account')
  }

  const goToManageUsers = () => {
    setAuthMode('manage_users')
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goToForgot} style={styles.link}>
        <Text style={styles.text}>forgot_password</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={goToDelete} style={styles.link}>
        <Text style={styles.text}>delete_account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={goToManageUsers} style={[styles.link, styles.linkWithDot]}>
        <Text style={styles.text}>manage_users</Text>
        {usersWithReminders.size > 0 && (
          <NotificationDot
            style={styles.reminderDot}
            accessibilityLabel={translate('period_reminder_waiting')}
          />
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-end',
    marginTop: 12,
  },
  link: {
    marginBottom: 4,
  },
  linkWithDot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderDot: {
    marginLeft: 6,
  },
  text: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
})
