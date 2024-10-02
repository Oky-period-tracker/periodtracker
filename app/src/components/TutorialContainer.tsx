import React from 'react'
import { Modal as RNModal, StyleSheet, TouchableOpacity, View } from 'react-native'
import { useTutorial } from '../screens/MainScreen/TutorialContext'
import { useThrottledFunction } from '../hooks/useThrottledFunction'
import { TutorialSkip } from '../screens/MainScreen/components/TutorialSkip'
import { useLoading } from '../contexts/LoadingProvider'
import { useResponsive } from '../contexts/ResponsiveContext'
import { useColor } from '../hooks/useColor'

export interface TutorialContainerProps {
  children?: React.ReactNode
}

export const TutorialContainer = ({ children }: TutorialContainerProps) => {
  const { dispatch } = useTutorial()
  const { loading } = useLoading()
  const { UIConfig } = useResponsive()
  const { modalBackdropColor } = useColor()

  const onContinue = () => {
    dispatch({ type: 'continue' })
  }

  // Prevent double clicking
  const continueThrottled = useThrottledFunction(onContinue, 350)

  return (
    <RNModal
      visible={!loading}
      animationType={'fade'}
      transparent={true}
      statusBarTranslucent={true}
      supportedOrientations={['portrait', 'landscape']}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop: UIConfig.tutorial.paddingTop,
            paddingBottom: UIConfig.tutorial.paddingBottom,
          },
        ]}
      >
        <TutorialSkip />
        <View style={[styles.backDrop, { backgroundColor: modalBackdropColor }]} />
        <TouchableOpacity style={styles.touchableOverlay} onPress={continueThrottled} />
        {children}
      </View>
    </RNModal>
  )
}

const styles = StyleSheet.create({
  backDrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  touchableOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  container: {
    height: '100%',
    width: '100%',
  },
})
