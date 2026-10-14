import React from 'react'
import { View, StyleSheet, Modal, TouchableOpacity, Switch as RNSwitch, Alert, Linking } from 'react-native'
import { Text } from '../../../components/Text'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useDispatch } from 'react-redux'
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
        'Allow notifications first',
        'Turn on notifications in your device settings before enabling period reminders.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open settings', onPress: () => Linking.openSettings() },
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
        <View style={styles.modal}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <FontAwesome name="times-circle" size={24} color="#9BC53D" />
          </TouchableOpacity>

          <Text style={styles.title}>
            Choose how often you want your reminders before your period is likely to start
          </Text>

          <Text style={styles.subtitle}>Set yourself reminders for</Text>

          <View style={styles.remindersContainer}>
            <View style={styles.reminderRow}>
              <Text style={styles.reminderText}>5 days before</Text>
              <RNSwitch
                value={selectedReminder === 'fiveDays'}
                onValueChange={() => handleReminderToggle('fiveDays')}
                trackColor={{ false: '#D6D6D6', true: '#9BC53D' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.reminderRow}>
              <Text style={styles.reminderText}>3 days before</Text>
              <RNSwitch
                value={selectedReminder === 'threeDays'}
                onValueChange={() => handleReminderToggle('threeDays')}
                trackColor={{ false: '#D6D6D6', true: '#9BC53D' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.reminderRow}>
              <Text style={styles.reminderText}>1 day before</Text>
              <RNSwitch
                value={selectedReminder === 'oneDay'}
                onValueChange={() => handleReminderToggle('oneDay')}
                trackColor={{ false: '#D6D6D6', true: '#9BC53D' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, isSetNotificationDisabled && styles.disabledButton]}
              onPress={handleSetNotifications}
              disabled={isSetNotificationDisabled}
            >
              <Text style={styles.buttonText}>Set notifications</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.disableButton} onPress={handleDisableNotifications}>
              <Text style={styles.disableButtonText}>Disable</Text>
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
    backgroundColor: '#FFFFFF',
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
    color: '#EB3F87',
    alignSelf: 'center',
    width: '94%',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'left',
    marginBottom: 6,
    color: '#242424',
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
    color: '#333333',
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
    backgroundColor: '#FF9800',
    minHeight: 42,
    flex: 1,
  },
  disabledButton: {
    opacity: 0.45,
  },
  buttonText: {
    color: '#fff',
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EB3F87',
    minHeight: 40,
    flex: 1,
  },
  disableButtonText: {
    color: '#EB3F87',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
})
