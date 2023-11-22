import Modal from 'react-native-modal'
import React from 'react'
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native'
import { IconButton } from './buttons/IconButton'
import { translate } from '../../i18n'

export function ThemedModal({
  isVisible,
  setIsVisible,
  includeCloseButton = true,
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
      customBackdrop={
        <TouchableOpacity
          onPress={onBackdropPress}
          importantForAccessibility="no-hide-descendants"
          style={styles.backdrop}
        />
      }
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
      {includeCloseButton ? (
        <IconButton
          name="close"
          accessibilityLabel="close"
          onPress={() => setIsVisible(false)}
          touchableStyle={styles.close}
        />
      ) : null}
      {children}
    </Modal>
  )
}

const styles = StyleSheet.create({
  close: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'black',
  },
})
