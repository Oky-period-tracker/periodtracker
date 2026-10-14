import React from 'react'
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text } from '../../../components/Text'
import { ReminderFrequency } from '../../../redux/actions/notificationActions'

export const NOTIFICATIONS_PERMISSION_PROMPT_KEY = 'period_notifications_permission_prompt_seen'

export const shouldShowNotificationsPermissionPrompt = (
  reminderFrequency: ReminderFrequency,
  hasSeenPrompt = false,
): boolean => !reminderFrequency && !hasSeenPrompt

interface NotificationsPermissionModalProps {
  visible: boolean
  onCancel: () => void
  onProceed: () => void
}

export const NotificationsPermissionModal = ({
  visible,
  onCancel,
  onProceed,
}: NotificationsPermissionModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Turn on notifications and reminder?</Text>
            <Text style={styles.subtitle}>
              Oky can send you gentle reminders to help you follow your period and take care of
              yourself. You can always change your mind in the settings page.
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.proceedButton]} onPress={onProceed}>
              <Text style={styles.proceedText}>Proceed</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modal: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 18,
  },
  textContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    lineHeight: 28,
    color: '#1F1F1F',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1F1F1F',
    textAlign: 'left',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F3F3',
  },
  proceedButton: {
    backgroundColor: '#EB3F87',
  },
  cancelText: {
    color: '#333333',
    fontSize: 15,
    fontWeight: '600',
  },
  proceedText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
})
