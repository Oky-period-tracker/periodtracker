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
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useScreenDimensions } from '../hooks/useScreenDimensions'
import { useAccessibilityLabel } from '../hooks/useAccessibilityLabel'
import { Button, ButtonProps } from './Button'
import { useColor } from '../hooks/useColor'

export interface ModalProps {
  visible: boolean
  toggleVisible: () => void
  children?: React.ReactNode
  footer?: React.ReactNode
  style?: StyleProp<ViewStyle>
  hideLaunchButton?: boolean
  onHandleResponse?: (response: boolean, periodDate: string) => void
  onDismiss?: () => void
}

export const Modal = ({
  visible,
  toggleVisible,
  children,
  footer,
  style,
  onDismiss,
}: ModalProps) => {
  const { modalBackdropColor } = useColor()
  const { width, height } = useScreenDimensions()
  const maxWidth = Math.min(width, 800)
  const maxHeight = height * 0.6

  return (
    <RNModal
      visible={visible}
      onRequestClose={toggleVisible}
      onDismiss={onDismiss}
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
        <ModalCloseButton onPress={toggleVisible} />
        <SafeAreaView
          style={[styles.children, { maxWidth, maxHeight }, style]}
          pointerEvents="box-none"
        >
          {children}
        </SafeAreaView>
        {footer && <View style={[styles.footer, { maxWidth }]}>{footer}</View>}
      </View>
    </RNModal>
  )
}

export const ModalCloseButton = (props: ButtonProps) => {
  const getAccessibilityLabel = useAccessibilityLabel()
  const label = getAccessibilityLabel('close')
  const insets = useSafeAreaInsets()

  return (
    <TouchableOpacity
      style={[styles.closeButton, { top: insets.top + 12 }]}
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
    flex: 1,
    margin: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    alignItems: 'center',
    width: '100%',
  },
  closeButton: {
    position: 'absolute',
    right: 24,
    width: 32,
    height: 32,
    zIndex: 9999,
    backgroundColor: '#A4D233',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
