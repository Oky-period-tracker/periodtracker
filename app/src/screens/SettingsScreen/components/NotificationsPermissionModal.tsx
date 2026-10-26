import React from 'react'
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text } from '../../../components/Text'
import { useColor } from '../../../hooks/useColor'

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
  const { color, backgroundColor, palette } = useColor()

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor }]}>
          <View style={styles.textContainer}>
            <Text style={[styles.title, { color }]}>notifications_permission_prompt_title</Text>
            <Text style={[styles.subtitle, { color } ]}>
              notifications_permission_prompt_description
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: palette.basic.highlight }]}
              onPress={onCancel}
            >
              <Text style={[styles.cancelText, { color }]}>cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: palette.danger.base }]}
              onPress={onProceed}
            >
              <Text style={[styles.proceedText, { color: palette.danger.highlight }]}>proceed</Text>
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
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
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
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
  },
  proceedText: {
    fontSize: 15,
    fontWeight: '600',
  },
})
