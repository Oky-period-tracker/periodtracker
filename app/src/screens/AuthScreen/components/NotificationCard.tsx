import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '../../../components/Text'
import { useColor } from '../../../hooks/useColor'
import { useTranslate } from '../../../hooks/useTranslate'
import { FontAwesome } from '@expo/vector-icons'
import { DisplayButton } from '../../../components/Button'
import { requestPermission } from '../../../hooks/useMessaging'
import { NotificationsPreferencesModal } from '../../SettingsScreen/components/NotificationsPreferencesModal'

interface NotificationCardProps {
  onYes: () => void
  onNo: () => void
}

export const NotificationCard = ({ onYes, onNo }: NotificationCardProps) => {
  const { palette, backgroundColor } = useColor()
  const t = useTranslate()
  const [loading, setLoading] = React.useState(false)
  const [modalVisible, setModalVisible] = React.useState(false)

  const handleYes = async () => {
    setLoading(true)
    try {
      // Request notification permission from user when they click Yes
      await requestPermission()
    } catch (error) {
      // Error requesting notification permission
    } finally {
      setLoading(false)
      // Open the reminder preferences modal
      setModalVisible(true)
    }
  }

  const handleModalClose = () => {
    setModalVisible(false)
    // After modal closes, proceed to next step (Sign Up/Log In)
    onYes()
  }

  return (
    <View style={[styles.page, { backgroundColor }]}>
      <View style={styles.content}>
        <DisplayButton status={'primary'} style={styles.icon}>
          <FontAwesome name={'bell'} size={40} color="white" />
        </DisplayButton>

        <Text style={styles.title}>{t('notification_permission_title')}</Text>
        <Text style={styles.description}>{t('notification_permission_description')}</Text>

        <View style={styles.footer}>
          <Text style={[styles.hint, { color: '#000' }]}>
            {t('notification_permission_hint')}
          </Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.buttonLeft}
          onPress={onNo}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{t('no')}</Text>
        </TouchableOpacity>
        <View style={styles.buttonDivider} />
        <TouchableOpacity
          style={styles.buttonRight}
          onPress={handleYes}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{t('yes')}</Text>
        </TouchableOpacity>
      </View>

      <NotificationsPreferencesModal
        visible={modalVisible}
        onClose={handleModalClose}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  page: {
    maxWidth: 800,
    borderRadius: 20,
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 0,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  icon: {
    height: 80,
    width: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '400',
  },
  footer: {
    marginTop: 16,
  },
  hint: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#f0f0f0',
  },
  buttonLeft: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  buttonRight: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  buttonDivider: {
    width: 1,
    backgroundColor: '#d0d0d0',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
  },
})
