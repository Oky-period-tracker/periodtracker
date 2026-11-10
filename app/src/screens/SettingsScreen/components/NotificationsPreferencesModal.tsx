import React from 'react'
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Switch as RNSwitch,
  Alert,
  Linking,
} from 'react-native'
import { Text } from '../../../components/Text'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useDispatch } from 'react-redux'
import { useColor } from '../../../hooks/useColor'
import { useTranslate } from '../../../hooks/useTranslate'
import { useSelector } from '../../../redux/useSelector'
import { setNotificationReminder } from '../../../redux/actions'
import { notificationReminderFrequencySelector } from '../../../redux/selectors'
import { usePeriodReminderSync, useTestPeriodReminder } from '../../../hooks/usePeriodReminderSync'
import { ReminderFrequency } from '../../../services/notificationScheduler'
import { requestAppNotificationPermission } from '../../../services/periodReminderLocalNotification'
import { ENV } from '../../../config/env'

// Debugging aid, never shown in production builds
const SHOW_TEST_REMINDER = ENV !== 'production'
const TEST_REMINDER_DELAY_SECONDS = 10

interface NotificationsPreferencesModalProps {
  visible: boolean
  onClose: () => void
}

export const NotificationsPreferencesModal = ({
  visible,
  onClose,
}: NotificationsPreferencesModalProps) => {
  const dispatch = useDispatch()
  const translate = useTranslate()
  const { palette, backgroundColor, color } = useColor()
  const savedReminderFrequency = useSelector(notificationReminderFrequencySelector)
  const syncPeriodReminders = usePeriodReminderSync()
  const testPeriodReminder = useTestPeriodReminder()

  const [selectedReminder, setSelectedReminder] = React.useState<ReminderFrequency | null>(
    savedReminderFrequency,
  )

  React.useEffect(() => {
    setSelectedReminder(savedReminderFrequency)
  }, [savedReminderFrequency, visible])

  const handleReminderToggle = (key: ReminderFrequency) => {
    setSelectedReminder(key)
  }

  const isSetNotificationDisabled = !selectedReminder

  const handleSetNotifications = async () => {
    if (!selectedReminder) return

    const hasPermission = await requestAppNotificationPermission()

    if (!hasPermission) {
      Alert.alert(
        translate('notifications_permission_required'),
        translate('notifications_enable_in_device_settings'),
        [
          { text: translate('cancel'), style: 'cancel' },
          { text: translate('open_settings'), onPress: () => Linking.openSettings() },
        ],
      )
      return
    }

    dispatch(setNotificationReminder(selectedReminder))

    try {
      await syncPeriodReminders(selectedReminder)
    } finally {
      onClose()
    }
  }

  const handleDisableNotifications = async () => {
    dispatch(setNotificationReminder(null))

    try {
      // Cancels only this account's reminders
      await syncPeriodReminders(null)
    } finally {
      onClose()
    }
  }

  // Delayed to leave time to close the app, or to log out and check the dot on the login screen.
  // Going back to the Home tab first resyncs the reminders, which replaces this one.
  const handleTestReminder = async () => {
    const scheduled =
      (await requestAppNotificationPermission()) &&
      (await testPeriodReminder(TEST_REMINDER_DELAY_SECONDS))

    Alert.alert(
      'Test reminder',
      scheduled
        ? `Arrives in ${TEST_REMINDER_DELAY_SECONDS} seconds, whether Oky is open or closed.`
        : 'Not scheduled: notifications are not allowed for Oky on this device.',
    )
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor }]}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <FontAwesome name="times-circle" size={24} color={palette.primary.base} />
          </TouchableOpacity>

          <Text style={[styles.title, { color: palette.danger.base }]}>
            notifications_choose_reminder_title
          </Text>

          <Text style={[styles.subtitle, { color }]}>notifications_set_reminders_for</Text>

          <View style={styles.remindersContainer}>
            <View style={styles.reminderRow}>
              <Text style={[styles.reminderText, { color }]}>notifications_five_days_before</Text>
              <RNSwitch
                value={selectedReminder === 'fiveDays'}
                onValueChange={() => handleReminderToggle('fiveDays')}
                trackColor={{ false: palette.basic.base, true: palette.primary.base }}
                thumbColor={backgroundColor}
              />
            </View>

            <View style={styles.reminderRow}>
              <Text style={[styles.reminderText, { color }]}>notifications_three_days_before</Text>
              <RNSwitch
                value={selectedReminder === 'threeDays'}
                onValueChange={() => handleReminderToggle('threeDays')}
                trackColor={{ false: palette.basic.base, true: palette.primary.base }}
                thumbColor={backgroundColor}
              />
            </View>

            <View style={styles.reminderRow}>
              <Text style={[styles.reminderText, { color }]}>notifications_one_day_before</Text>
              <RNSwitch
                value={selectedReminder === 'oneDay'}
                onValueChange={() => handleReminderToggle('oneDay')}
                trackColor={{ false: palette.basic.base, true: palette.primary.base }}
                thumbColor={backgroundColor}
              />
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: palette.secondary.base },
                isSetNotificationDisabled && styles.disabledButton,
              ]}
              onPress={handleSetNotifications}
              disabled={isSetNotificationDisabled}
            >
              <Text style={[styles.buttonText, { color: backgroundColor }]}>notifications_set</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.disableButton, { borderColor: palette.danger.base }]}
              onPress={handleDisableNotifications}
            >
              <Text style={[styles.disableButtonText, { color: palette.danger.base }]}>
                notifications_disable
              </Text>
            </TouchableOpacity>
          </View>

          {SHOW_TEST_REMINDER && (
            <TouchableOpacity style={styles.testButton} onPress={handleTestReminder}>
              <Text style={[styles.testButtonText, { color }]} enableTranslate={false}>
                {`Debug: send a test reminder in ${TEST_REMINDER_DELAY_SECONDS} s`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    borderRadius: 10,
    paddingTop: 28,
    paddingBottom: 16,
    paddingHorizontal: 18,
    width: '86%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    padding: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 18,
    textAlign: 'center',
    lineHeight: 24,
    alignSelf: 'center',
    width: '94%',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'left',
    marginBottom: 6,
  },
  remindersContainer: {
    marginBottom: 14,
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
  },
  reminderText: {
    fontSize: 13,
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
    width: '100%',
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 42,
    flex: 1,
  },
  disabledButton: {
    opacity: 0.45,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  disableButton: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    minHeight: 40,
    flex: 1,
  },
  disableButtonText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  testButton: {
    marginTop: 12,
    paddingVertical: 8,
    alignItems: 'center',
  },
  testButtonText: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
})
