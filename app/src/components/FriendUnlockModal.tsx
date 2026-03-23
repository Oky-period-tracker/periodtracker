import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { Modal, ModalProps } from './Modal'
import { Text } from './Text'
import { getAsset } from '../services/asset'
import { useAccessibilityLabel } from '../hooks/useAccessibilityLabel'
import { useResponsive } from '../contexts/ResponsiveContext'
import { styles } from './FriendUnlockModal.styles'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from '../redux/useSelector'
import { appTokenSelector, currentUserSelector } from '../redux/selectors'
import { httpClient } from '../services/HttpClient'
import { useDispatch } from 'react-redux'
import { User } from '../types'
import { editUser } from '../redux/actions'


export const FriendUnlockModal = ({
  visible,
  toggleVisible,
}: ModalProps) => {
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const navigation = useNavigation() as any
  const currentUser = useSelector(currentUserSelector)
  const appToken = useSelector(appTokenSelector)
  const { width: responsiveWidth } = useResponsive()
  const getAccessibilityLabel = useAccessibilityLabel()
  const reduxDispatch = useDispatch()
  const editUserReduxState = (changes: Partial<User>) => {
    reduxDispatch(editUser(changes))
  }

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

        await httpClient.updateAvatar({
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

  const modalWidth = responsiveWidth >= 840 
    ? Math.min(responsiveWidth * 0.9, 600) 
    : responsiveWidth * 0.95

  return (
    <Modal visible={visible} toggleVisible={toggleVisible} style={[styles.modal, { 
      width: modalWidth,
      maxWidth: responsiveWidth >= 840 ? 600 : undefined,
      minWidth: undefined,
      borderRadius: responsiveWidth >= 840 ? 24 : 20,
    }]}>
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
          <Text style={styles.buttonText} enableTranslate={true}>friend_unlock_modal_button</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}


