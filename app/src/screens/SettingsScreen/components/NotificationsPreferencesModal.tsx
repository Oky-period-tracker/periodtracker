import React from 'react'
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView, Switch as RNSwitch, Alert } from 'react-native'
import { Text } from '../../../components/Text'
import { useColor } from '../../../hooks/useColor'
import { useTranslate } from '../../../hooks/useTranslate'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useDispatch } from 'react-redux'
import { useSelector } from '../../../redux/useSelector'
import { setNotificationReminder, setNotificationsEnabled } from '../../../redux/actions'
import { notificationReminderFrequencySelector } from '../../../redux/selectors'
import { usePredictionEngineState } from '../../../contexts/PredictionProvider'
import { getNextPredictedPeriodDate } from '../../../services/notificationScheduler'
import {
  cancelScheduledPeriodReminderNotification,
  scheduleDebugPeriodReminderNotification,
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
  const { palette, backgroundColor } = useColor()
  const t = useTranslate()
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

  const handleSetNotifications = async () => {
    if (!selectedReminder) return

    dispatch(setNotificationsEnabled(true))
    dispatch(setNotificationReminder(selectedReminder))

    const nextPredictedPeriodDate = getNextPredictedPeriodDate(predictionFullState)

    try {
      await syncPeriodReminderLocalNotification({
        isEnabled: true,
        reminderFrequency: selectedReminder,
        predictedPeriodDate: nextPredictedPeriodDate,
      })
    } catch (error) {
      // Do not block closing the modal if scheduling fails in the background.
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

  const handleDebugNotification = async () => {
    try {
      const result = await scheduleDebugPeriodReminderNotification(2)

      if (!result) {
        Alert.alert(
          'Debug reminder not scheduled',
          'Notification permission is not granted. Please allow notifications in system settings and try again.',
        )
        return
      }

      Alert.alert(
        'Debug reminder scheduled',
        `Notification ID: ${result.notificationId}\nScheduled for: ${result.scheduledFor}`,
      )
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error while scheduling debug notification.'
      Alert.alert(
        'Debug reminder failed',
        errorMessage,
      )
    }
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor }]}>
          {/* Close button and reminder options */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <FontAwesome name="times" size={24} color={palette.primary.base} />
          </TouchableOpacity>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={[styles.title, { color: palette.danger.text }]}>
              {t('notification_preference_title')}
            </Text>

            <Text style={[styles.subtitle, { color: palette.basic.text }]}>
              {t('notification_preference_subtitle')}
            </Text>

            {/* Select reminder frequency: 1, 3, or 5 days before period */}
            <View style={styles.remindersContainer}>
              <View style={styles.reminderRow}>
                <Text style={[styles.reminderText, { color: palette.basic.text }]}>
                  {t('notification_5_days')}
                </Text>
                <RNSwitch
                  value={selectedReminder === 'fiveDays'}
                  onValueChange={() => handleReminderToggle('fiveDays')}
                  trackColor={{ false: palette.basic.dark, true: palette.primary.base }}
                  thumbColor={selectedReminder === 'fiveDays' ? palette.primary.base : palette.basic.base}
                />
              </View>

              {/* 3 Days Before */}
              <View style={styles.reminderRow}>
                <Text style={[styles.reminderText, { color: palette.basic.text }]}>
                  {t('notification_3_days')}
                </Text>
                <RNSwitch
                  value={selectedReminder === 'threeDays'}
                  onValueChange={() => handleReminderToggle('threeDays')}
                  trackColor={{ false: palette.basic.dark, true: palette.primary.base }}
                  thumbColor={selectedReminder === 'threeDays' ? palette.primary.base : palette.basic.base}
                />
              </View>

              <View style={styles.reminderRow}>
                <Text style={[styles.reminderText, { color: palette.basic.text }]}>
                  {t('notification_1_day')}
                </Text>
                <RNSwitch
                  value={selectedReminder === 'oneDay'}
                  onValueChange={() => handleReminderToggle('oneDay')}
                  trackColor={{ false: palette.basic.dark, true: palette.primary.base }}
                  thumbColor={selectedReminder === 'oneDay' ? palette.primary.base : palette.basic.base}
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: palette.secondary.base }]}
              onPress={handleSetNotifications}
            >
              <Text style={styles.buttonText}>
                {t('notification_set_button')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.disableButton, { borderColor: palette.danger.base, borderWidth: 1 }]}
              onPress={handleDisableNotifications}
            >
              <Text style={[styles.buttonText, { color: palette.danger.base }]}>
                {t('disable')}
              </Text>
            </TouchableOpacity>
          </View>

          {__DEV__ && (
            <View style={styles.debugContainer}>
              <TouchableOpacity
                style={[styles.debugButton, { borderColor: palette.primary.base }]}
                onPress={handleDebugNotification}
              >
                <Text style={[styles.debugButtonText, { color: palette.primary.base }]}> 
                  Debug: outer notification in 2 min
                </Text>
              </TouchableOpacity>
            </View>
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
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 8,
  },
  content: {
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  remindersContainer: {
    marginBottom: 24,
  },
  reminderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  reminderText: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 24,
    width: '100%',
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    minHeight: 48,
  },
  disableButton: {
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  debugContainer: {
    width: '100%',
    marginTop: 12,
  },
  debugButton: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  debugButtonText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
})
