import React from 'react'
import { View, TouchableOpacity, Image } from 'react-native'
import { Modal, ModalProps } from './Modal'
import { Text } from './Text'
import { getAsset } from '../services/asset'
import { useScreenDimensions } from '../hooks/useScreenDimensions'
import { useAccessibilityLabel } from '../hooks/useAccessibilityLabel'
import { useResponsive } from '../contexts/ResponsiveContext'
import { styles } from './FriendUnlockModal.styles'

interface FriendUnlockModalProps extends ModalProps {
  onCreateFriend: () => void
}

export const FriendUnlockModal = ({
  visible,
  toggleVisible,
  onCreateFriend,
}: FriendUnlockModalProps) => {
  const { width } = useScreenDimensions()
  const { width: responsiveWidth } = useResponsive()
  const getAccessibilityLabel = useAccessibilityLabel()

  const handleCreateFriend = () => {
    toggleVisible()
    onCreateFriend()
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


