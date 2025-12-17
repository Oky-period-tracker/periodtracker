import React from 'react'
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native'
import { Modal, ModalProps } from './Modal'
import { Text } from './Text'
import { Button } from './Button'
import { getAsset } from '../services/asset'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useScreenDimensions } from '../hooks/useScreenDimensions'
import { useAccessibilityLabel } from '../hooks/useAccessibilityLabel'
import { moderateScale } from 'react-native-size-matters'
import { useResponsive } from '../contexts/ResponsiveContext'

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

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: moderateScale(24, 0.3),
    paddingTop: moderateScale(50, 0.3),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: 'bold',
    color: '#E91E63',
    textAlign: 'center',
    marginBottom: moderateScale(24, 0.3),
    width: '100%',
  },
  iconContainer: {
    width: moderateScale(280, 0.3),
    height: moderateScale(280, 0.3),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(24, 0.3),
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  createButton: {
    width: 'auto',
    height: 'auto',
    minHeight: moderateScale(50, 0.3),
    borderRadius: moderateScale(8, 0.3),
    paddingVertical: moderateScale(14, 0.3),
    paddingHorizontal: moderateScale(28, 0.3),
    minWidth: moderateScale(180, 0.3),
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: moderateScale(16, 0.3),
    fontWeight: 'bold',
  },
})

