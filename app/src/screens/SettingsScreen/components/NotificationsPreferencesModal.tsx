import React from 'react'
import { View, StyleSheet, Modal, TouchableOpacity, Switch as RNSwitch, Alert, Linking } from 'react-native'
import { Text } from '../../../components/Text'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useDispatch } from 'react-redux'
import { useColor } from '../../../hooks/useColor'
import { useTranslate } from '../../../hooks/useTranslate'
import { useSelector } from '../../../redux/useSelector'
import { setNotificationReminder, setNotificationsEnabled } from '../../../redux/actions'
import { notificationReminderFrequencySelector } from '../../../redux/selectors'
import { usePredictionEngineState } from '../../../contexts/PredictionProvider'
import { getNextPredictedPeriodDate } from '../../../services/notificationScheduler'
import {
  cancelScheduledPeriodReminderNotification,
  requestAppNotificationPermission,
  syncPeriodReminderLocalNotification,
} from '../../../services/periodReminderLocalNotification'

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
  const predictionFullState = usePredictionEngineState()

  const [selectedReminder, setSelectedReminder] = React.useState<'fiveDays' | 'threeDays' | 'oneDay' | null>(
    savedReminderFrequency,
  )

  React.useEffect(() => {
    setSelectedReminder(savedReminderFrequency)
  }, [savedReminderFrequency, visible])

  const handleReminderToggle = (key: 'fiveDays' | 'threeDays' | 'oneDay') => {
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

    dispatch(setNotificationsEnabled(true))
    dispatch(setNotificationReminder(selectedReminder))

    const nextPredictedPeriodDate = getNextPredictedPeriodDate(predictionFullState)

    try {
      await syncPeriodReminderLocalNotification({
        isEnabled: true,
        reminderFrequency: selectedReminder,
        predictedPeriodDate: nextPredictedPeriodDate,
      })
    } finally {
      onClose()
    }
  }

  const handleDisableNotifications = async () => {
    dispatch(setNotificationsEnabled(false))
    dispatch(setNotificationReminder(null))

    await cancelScheduledPeriodReminderNotification()
    onClose()
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
              <Text style={[styles.buttonText, { color: backgroundColor }]}>
                notifications_set
              </Text>
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
})
