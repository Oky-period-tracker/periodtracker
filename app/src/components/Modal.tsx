import React from 'react'
import {
  Modal as RNModal,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useScreenDimensions } from '../hooks/useScreenDimensions'
import { useAccessibilityLabel } from '../hooks/useAccessibilityLabel'
import { Button, ButtonProps } from './Button'
import { useColor } from '../hooks/useColor'

export interface ModalProps {
  visible: boolean
  toggleVisible: () => void
  children?: React.ReactNode
  style?: StyleProp<ViewStyle>
  hideLaunchButton?: boolean
  onHandleResponse?: (response: boolean, periodDate: string) => void
}

export const Modal = ({ visible, toggleVisible, children, style }: ModalProps) => {
  const { modalBackdropColor } = useColor()
  const { width, height } = useScreenDimensions()
  const maxWidth = Math.min(width, 800)
  const minWidth = Math.min(width * 0.85, 600) // Ensure modal has reasonable minimum width
  const maxHeight = height * 0.85 // Increased to 85% to allow more content

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
        <TouchableOpacity
          style={[styles.backDrop, { backgroundColor: modalBackdropColor }]}
          onPress={toggleVisible}
        />
        <SafeAreaView
          style={[styles.children, { maxWidth, minWidth, maxHeight }, style]}
          pointerEvents="box-none"
        >
          <ModalCloseButton onPress={toggleVisible} />
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
    <TouchableOpacity
      style={[styles.closeButton, { backgroundColor: '#A4D233' }]}
      onPress={props.onPress}
      accessibilityLabel={label}
    >
      <FontAwesome name="close" size={18} color="#FFFFFF" />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  backDrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  children: {
    margin: 24,
    position: 'relative',
    alignSelf: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
})
