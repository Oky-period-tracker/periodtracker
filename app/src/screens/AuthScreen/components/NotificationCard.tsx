import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '../../../components/Text'
import { useColor } from '../../../hooks/useColor'
import { NotificationsPreferencesModal } from '../../SettingsScreen/components/NotificationsPreferencesModal'
import { requestAppNotificationPermission } from '../../../services/periodReminderLocalNotification'
import { getStandardAvatarSvg } from '../../../resources/assets/friendAssets'

interface NotificationCardProps {
  onYes: () => void
  onNo: () => void
}

export const NotificationCard = ({ onYes, onNo }: NotificationCardProps) => {
  const { backgroundColor } = useColor()
  const [loading, setLoading] = React.useState(false)
  const [modalVisible, setModalVisible] = React.useState(false)
  const AnuAvatarSvg = getStandardAvatarSvg('julia')

  const handleYes = async () => {
    setLoading(true)

    try {
      await requestAppNotificationPermission()
    } catch (error) {
      // Allow the user to continue configuring period reminders even if the OS prompt fails.
    } finally {
      setLoading(false)
      setModalVisible(true)
    }
  }

  const handleModalClose = () => {
    setModalVisible(false)
    onYes()
  }

  return (
    <View style={[styles.page, { backgroundColor }]}>
      <View style={styles.card}>
        <View style={styles.content}>
          <View style={styles.artworkContainer}>
            <View style={[styles.dot, styles.dotGreen]} />
            <View style={[styles.dot, styles.dotPink]} />
            <View style={[styles.dot, styles.dotYellow]} />

            <View style={styles.avatarBubble}>
              <View style={styles.avatarInnerCircle}>
                {AnuAvatarSvg
                  ? React.createElement(AnuAvatarSvg, { width: 48, height: 66 })
                  : null}
              </View>
            </View>
          </View>

          <Text style={styles.title}>Turn on notifications and reminders?</Text>
          <Text style={styles.description}>
            Oky can send you gentle reminders to help you follow your period and take care of
            yourself.
          </Text>

          <View style={styles.footer}>
            <Text style={styles.hint}>You can always change your mind in the Settings page</Text>
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.buttonLeft}
            onPress={onNo}
            disabled={loading}
          >
            <Text style={styles.buttonText}>no</Text>
          </TouchableOpacity>
          <View style={styles.buttonDivider} />
          <TouchableOpacity
            style={styles.buttonRight}
            onPress={handleYes}
            disabled={loading}
          >
            <Text style={styles.buttonText}>yes</Text>
          </TouchableOpacity>
        </View>
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
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  card: {
    width: '100%',
    alignSelf: 'stretch',
    height: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
    paddingTop: 52,
    paddingBottom: 20,
  },
  artworkContainer: {
    width: 190,
    height: 105,
    marginBottom: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBubble: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#d9d9d9',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  avatarInnerCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    borderRadius: 999,
  },
  dotGreen: {
    width: 56,
    height: 56,
    right: 36,
    top: 12,
    backgroundColor: '#a9d533',
    zIndex: 1,
  },
  dotPink: {
    width: 46,
    height: 46,
    right: 0,
    top: 30,
    backgroundColor: '#e55ea4',
    zIndex: 1,
  },
  dotYellow: {
    width: 30,
    height: 30,
    right: 46,
    bottom: 8,
    backgroundColor: '#ffd400',
    zIndex: 2,
  },
  title: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: '700',
    marginBottom: 18,
    textAlign: 'center',
    alignSelf: 'center',
    width: '92%',
    color: '#121212',
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 18,
    fontWeight: '400',
    color: '#1e1e1e',
  },
  footer: {
    marginTop: 2,
    paddingHorizontal: 8,
  },
  hint: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    color: '#1e1e1e',
  },
  buttonsContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 82,
    backgroundColor: '#ececec',
    borderTopWidth: 1,
    borderTopColor: '#d8d8d8',
  },
  buttonLeft: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ececec',
  },
  buttonRight: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ececec',
  },
  buttonDivider: {
    width: 1,
    backgroundColor: '#cfcfcf',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111',
  },
})
