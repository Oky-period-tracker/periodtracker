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
        <View style={styles.modal}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <FontAwesome name="times" size={24} color={palette.primary.base} />
          </TouchableOpacity>

          {/* Content */}
          <View style={styles.content}>
            <Text style={[styles.message, { color: palette.basic.text }]}>
              Your period may start soon. It may come earlier or later and that is okay. Oky is
              here for you. Want to know more? Visit the encyclopedia for simple tips and advice.
            </Text>
          </View>

          {/* Encyclopedia Arrow Button */}
          <TouchableOpacity
            style={[styles.encyclopediaButton, { backgroundColor: palette.secondary.base }]}
            onPress={handleEncyclopediaPress}
          >
            <FontAwesome name="arrow-right" size={20} color="white" />
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
    backgroundColor: 'rgba(173, 216, 230, 0.7)',
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
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
  },
  encyclopediaButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
