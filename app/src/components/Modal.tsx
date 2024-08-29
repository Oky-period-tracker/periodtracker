import React from 'react'
import { Modal as RNModal, StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useScreenDimensions } from '../hooks/useScreenDimensions'
import { IS_WEB } from '../services/device'
import { useAccessibilityLabel } from '../hooks/useAccessibilityLabel'
import { Button, ButtonProps } from './Button'

export interface ModalProps {
  visible: boolean
  toggleVisible: () => void
  children?: React.ReactNode
  style?: ViewStyle
}

export const Modal = ({ visible, toggleVisible, children, style }: ModalProps) => {
  const { width, height } = useScreenDimensions()
  const maxWidth = Math.min(width, 800)
  const maxHeight = height * 0.6

  return (
    <RNModal
      visible={visible}
      onRequestClose={toggleVisible}
      animationType={'fade'}
      transparent={true}
      statusBarTranslucent={true}
      supportedOrientations={['portrait', 'landscape']}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.backDrop} onPress={toggleVisible} />
        <ModalCloseButton onPress={toggleVisible} />
        <SafeAreaView
          style={[styles.children, { maxWidth, maxHeight }, style]}
          pointerEvents="box-none"
        >
          {children}
        </SafeAreaView>
      </View>
    </RNModal>
  )
}

export const ModalCloseButton = (props: ButtonProps) => {
  const getAccessibilityLabel = useAccessibilityLabel()
  const label = getAccessibilityLabel('close')

  return (
    <Button style={styles.closeButton} status={'basic'} {...props}>
      <FontAwesome name="close" size={24} color="white" accessibilityLabel={label} />
    </Button>
  )
}

const styles = StyleSheet.create({
  backDrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: IS_WEB ? 'center' : undefined,
  },
  children: {
    margin: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    width: 32,
    height: 32,
    zIndex: 9999,
  },
})
