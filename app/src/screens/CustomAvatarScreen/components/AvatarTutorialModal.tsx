import * as React from 'react'
import { View, StyleSheet, TouchableOpacity, Modal as RNModal, PanResponder, Image } from 'react-native'
import { Text } from '../../../components/Text'
import { Button } from '../../../components/Button'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useResponsive } from '../../../contexts/ResponsiveContext'
import { useColor } from '../../../hooks/useColor'
import { useTranslate } from '../../../hooks/useTranslate'
import { createAvatarTutorialModalStyles } from './AvatarTutorialModal.styles'
import { tutorialSteps, assets } from '../../../resources/assets'
import { useAccessibilityLabel } from '../../../hooks/useAccessibilityLabel'

// Tutorial step PNG images
const tutorialStepImages: Record<number, any> = {
  1: assets.tutorialSteps.step1,
  2: assets.tutorialSteps.step2,
  3: assets.tutorialSteps.step3,
  4: assets.tutorialSteps.step4,
  5: assets.tutorialSteps.step5,
}

interface AvatarTutorialModalProps {
  visible: boolean
  onClose: () => void
}

export const AvatarTutorialModal = ({ visible, onClose }: AvatarTutorialModalProps) => {
  const [currentStep, setCurrentStep] = React.useState(1)
  const { UIConfig, width } = useResponsive()
  const { modalBackdropColor } = useColor()
  const translate = useTranslate()
  const getAccessibilityLabel = useAccessibilityLabel()
  const styles = createAvatarTutorialModalStyles(UIConfig.avatarCustomization, width)
  const currentStepRef = React.useRef(currentStep)


  const totalSteps = 5

  // Keep ref in sync with state
  React.useEffect(() => {
    currentStepRef.current = currentStep
  }, [currentStep])

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    } else {
      onClose()
    }
  }

  const handleSkip = () => {
    onClose()
  }

  // Swipe gesture handler
  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal swipes
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10
      },
      onPanResponderRelease: (_, gestureState) => {
        const swipeThreshold = 50
        const step = currentStepRef.current
        if (gestureState.dx > swipeThreshold) {
          // Swipe right - go to previous step
          if (step > 1) {
            setCurrentStep(step - 1)
          }
        } else if (gestureState.dx < -swipeThreshold) {
          // Swipe left - go to next step
          if (step < totalSteps) {
            setCurrentStep(step + 1)
          } else {
            onClose()
          }
        }
      },
    })
  ).current

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return {
          titleKey: 'customizer_tutorial_step1_title',
          textKey: 'customizer_tutorial_step1_text',
        }
      case 2:
        return {
          titleKey: 'customizer_tutorial_step2_title',
          textKey: 'customizer_tutorial_step2_text',
        }
      case 3:
        return {
          titleKey: 'customizer_tutorial_step3_title',
          textKey: 'customizer_tutorial_step3_text',
        }
      case 4:
        return {
          titleKey: 'customizer_tutorial_step4_title',
          textKey: 'customizer_tutorial_step4_text',
        }
      case 5:
        return {
          titleKey: 'customizer_tutorial_step5_title',
          textKey: 'customizer_tutorial_step5_text',
        }
      default:
        return { titleKey: '', textKey: '' }
    }
  }

  const stepContent = getStepContent()
  const tutorialStepImage = React.useMemo(() => {
    return tutorialStepImages[currentStep]
  }, [currentStep])

  return (
    <RNModal
      visible={visible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.backdrop, { backgroundColor: modalBackdropColor }]}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modal} {...panResponder.panHandlers}>
          {/* Header */}
          <View style={styles.header}>
            <Button 
              onPress={handleBack} 
              style={styles.backButton}
              accessibilityLabel={getAccessibilityLabel('arrow_button')}
            >
              <FontAwesome size={12} name={'arrow-left'} color={'#fff'} />
            </Button>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle} enableTranslate={true}>customizer_tutorial_title</Text>
            </View>
          </View>

          {/* Tutorial Image */}
          {tutorialStepImage ? (
            <Image
              source={tutorialStepImage}
              style={{ width: '100%', minHeight: 200 }}
              resizeMode="contain"
            />
          ) : null}

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle} enableTranslate={true}>
              {stepContent.titleKey}
            </Text>
            {stepContent.textKey && (
              <Text style={styles.instructionsText} enableTranslate={true}>
                {stepContent.textKey}
              </Text>
            )}
          </View>

          {/* Progress Dots */}
          <View style={styles.progressContainer}>
            {Array.from({ length: totalSteps }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index + 1 === currentStep && styles.progressDotActive,
                ]}
              />
            ))}
          </View>

          {/* Navigation Buttons */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity 
              onPress={handleBack} 
              style={[styles.navButton, styles.navButtonBack]}
              accessibilityLabel={getAccessibilityLabel('customizer_tutorial_back')}
              accessibilityRole="button"
            >
              <Text style={styles.navButtonTextBack} enableTranslate={true}>
                customizer_tutorial_back
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleNext} 
              style={[styles.navButton, styles.navButtonNext]}
              accessibilityLabel={getAccessibilityLabel(currentStep === totalSteps ? 'customizer_tutorial_finish' : 'customizer_tutorial_next')}
              accessibilityRole="button"
            >
              <Text style={styles.navButtonTextNext} enableTranslate={true}>
                {currentStep === totalSteps ? 'customizer_tutorial_finish' : 'customizer_tutorial_next'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Skip Tutorial Link */}
          <TouchableOpacity 
            onPress={handleSkip} 
            style={styles.skipContainer}
            accessibilityLabel={getAccessibilityLabel('skip_tutorial_button')}
            accessibilityRole="button"
          >
            <Text style={styles.skipText}>skip_tutorial</Text>
          </TouchableOpacity>
        </View>
      </View>
    </RNModal>
  )
}
