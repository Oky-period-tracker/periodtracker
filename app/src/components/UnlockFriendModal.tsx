import React from 'react'
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import { Image } from 'expo-image'
import { Modal, ModalProps } from './Modal'
import { Text } from './Text'
import { getAsset } from '../services/asset'
import { useAccessibilityLabel } from '../hooks/useAccessibilityLabel'
import { useResponsive } from '../contexts/ResponsiveContext'

const { width: screenWidth } = Dimensions.get('window')
const guidelineBaseWidth = 350
const moderateScale = (size: number, factor = 0.5) =>
  size + (screenWidth / guidelineBaseWidth - 1) * size * factor

interface UnlockFriendModalProps extends ModalProps {
  onCreateFriend: () => void
}

/**
 * Unlock friend modal
 * Should appear the first time the user has entered 3 consecutive valid cycles.
 */
export const UnlockFriendModal = ({
  visible,
  toggleVisible,
  onCreateFriend,
}: UnlockFriendModalProps) => {
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
          accessibilityLabel={getAccessibilityLabel('unlock_friend_modal_title')}
        >
          unlock_friend_modal_title
        </Text>
        
        <View style={styles.animationContainer}>
          <Image
            source={getAsset('gifs.unlockFriend')}
            style={styles.animation}
            contentFit="contain"
            autoplay={true}
          />
        </View>
        
        <TouchableOpacity 
          onPress={handleCreateFriend} 
          style={[styles.createButton, { backgroundColor: '#FF9800' }]}
          accessibilityLabel={getAccessibilityLabel('unlock_friend_modal_button')}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText} enableTranslate={true}>unlock_friend_modal_button</Text>
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
    flex: 0,
  },
  content: {
    padding: moderateScale(24, 0.3),
    paddingTop: moderateScale(50, 0.3),
    paddingBottom: moderateScale(56, 0.3),
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
  animationContainer: {
    width: moderateScale(280, 0.3),
    height: moderateScale(280, 0.3),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: moderateScale(24, 0.3),
  },
  animation: {
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