import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import { Image } from 'expo-image'
import { Modal, ModalProps } from './Modal'
import { Text } from './Text'
import { getAsset } from '../services/asset'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from '../redux/useSelector'
import { appTokenSelector, currentUserSelector } from '../redux/selectors'
import { httpClient } from '../services/HttpClient'
import { User } from '../types'
import { useDispatch } from 'react-redux'
import { editUser } from '../redux/actions'
import { useAccessibilityLabel } from '../hooks/useAccessibilityLabel'

/**
 * Modal appearing when custom avatar is made available.
 */
export const FriendUnlockModal = ({ visible, toggleVisible }: ModalProps) => {
  // todo: improve typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation() as any
  const currentUser = useSelector(currentUserSelector)
  const appToken = useSelector(appTokenSelector)
  const getAccessibilityLabel = useAccessibilityLabel()
  const reduxDispatch = useDispatch()
  const editUserReduxState = (changes: Partial<User>) => {
    reduxDispatch(editUser(changes))
  }

  /**
   * Handle create friend click from modal
   * Redirects to Edit Avatar page.
   */
  const handleCreateFriend = async () => {
    toggleVisible()
    // Navigate to custom avatar screen
    const parentNavigation = navigation.getParent()
    parentNavigation.navigate('profile', { screen: 'EditAvatar' })

    // Update avatar to set customAvatarUnlocked to true
    if (appToken && currentUser) {
      try {
        const updatedAvatar = currentUser.avatar
          ? {
              ...currentUser.avatar,
              customAvatarUnlocked: true,
            }
          : {
              body: null,
              hair: null,
              eyes: null,
              clothing: null,
              devices: null,
              customAvatarUnlocked: true,
            }

        await httpClient.editAvatar({
          appToken,
          avatar: updatedAvatar,
        })

        // Update Redux state
        editUserReduxState({
          avatar: updatedAvatar,
        })
      } catch (error) {
        // todo: improve error handling
      }
    }
  }

  return (
    <Modal visible={visible} toggleVisible={toggleVisible} style={styles.modal}>
      <View style={styles.content}>
        <Text
          style={styles.title}
          enableTranslate={true}
          accessibilityLabel={getAccessibilityLabel('friend_unlock_modal_title')}
        >
          friend_unlock_modal_title
        </Text>

        <View style={styles.iconContainer}>
          <Image
            source={getAsset('gifs.friendUnlock')}
            style={styles.icon}
            resizeMode="contain"
            accessibilityLabel={getAccessibilityLabel('friend_unlock_celebration_image')}
            accessibilityRole="image"
          />
        </View>

        <TouchableOpacity
          onPress={handleCreateFriend}
          style={[styles.createButton, { backgroundColor: '#FF9800' }]}
          accessibilityLabel={getAccessibilityLabel('friend_unlock_modal_button')}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText} enableTranslate={false}>
            friend_unlock_modal_button
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 0,
    maxWidth: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E91E63',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  createButton: {
    width: 'auto',
    height: 'auto',
    minHeight: 50,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
