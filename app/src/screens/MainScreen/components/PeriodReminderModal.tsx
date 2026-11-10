import React from 'react'
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native'
import { Text } from '../../../components/Text'
import { useColor } from '../../../hooks/useColor'
import FontAwesome from '@expo/vector-icons/FontAwesome'

interface PeriodReminderModalProps {
  visible: boolean
  onClose: () => void
  onNavigateToEncyclopedia?: () => void
}

export const PeriodReminderModal = ({
  visible,
  onClose,
  onNavigateToEncyclopedia,
}: PeriodReminderModalProps) => {
  const { palette } = useColor()

  const handleEncyclopediaPress = () => {
    if (onNavigateToEncyclopedia) {
      onNavigateToEncyclopedia()
    }
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: palette.neutral.base }]}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <FontAwesome name="times" size={24} color={palette.primary.base} />
          </TouchableOpacity>

          {/* Content */}
          <View style={styles.content}>
            <Text style={[styles.message, { color: palette.basic.text }]}>
              period_reminder_modal_message
            </Text>
          </View>

          {/* Encyclopedia Arrow Button */}
          <TouchableOpacity
            style={[styles.encyclopediaButton, { backgroundColor: palette.secondary.base }]}
            onPress={handleEncyclopediaPress}
          >
            <FontAwesome name="arrow-right" size={20} color={palette.basic.highlight} />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modal: {
    borderRadius: 20,
    padding: 24,
    width: '85%',
    maxHeight: '70%',
    position: 'relative',
    marginBottom: 280,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 8,
  },
  content: {
    marginTop: 32,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
  },
  // Below the message rather than over it, so longer translations never get covered
  encyclopediaButton: {
    alignSelf: 'flex-end',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
