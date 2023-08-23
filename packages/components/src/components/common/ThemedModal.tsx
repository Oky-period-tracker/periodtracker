import Modal from 'react-native-modal'
import React from 'react'
import { Platform } from 'react-native'

export function ThemedModal({
  isVisible,
  setIsVisible,
  children,
  onModalHide = () => null,
  onModalWillShow = () => null,
  animationIn = 'fadeIn',
  animationOut = 'fadeOut',
  onBackdropPress = () => setIsVisible(false),
  backdropOpacity = 0.8,
  animationOutTiming = Platform.OS === 'ios' ? 300 : 600,
}) {
  return (
    // @ts-ignore
    <Modal
      isVisible={isVisible}
      backdropOpacity={backdropOpacity}
      // @ts-ignore
      animationIn={animationIn}
      // @ts-ignore
      animationOut={animationOut}
      animationInTiming={600}
      animationOutTiming={animationOutTiming}
      backdropTransitionInTiming={600}
      backdropTransitionOutTiming={600}
      onModalHide={onModalHide}
      onModalWillShow={onModalWillShow}
      onBackdropPress={onBackdropPress}
      hideModalContentWhileAnimating={true}
      useNativeDriver={true}
    >
      {children}
    </Modal>
  )
}
