import * as React from 'react'
import { View, TouchableOpacity, Modal as RNModal, PanResponder, Image, ImageSourcePropType } from 'react-native'
import { Text } from '../../../components/Text'
import { Button } from '../../../components/Button'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { useResponsive } from '../../../contexts/ResponsiveContext'
import { useColor } from '../../../hooks/useColor'
import { createAvatarTutorialModalStyles } from './AvatarTutorialModal.styles'
import { assets } from '../../../resources/assets'

// Tutorial step PNG images
const tutorialStepImages: Record<number, ImageSourcePropType> = {
  1: assets.tutorial.avatar.step1,
  2: assets.tutorial.avatar.step2,
  3: assets.tutorial.avatar.step3,
  4: assets.tutorial.avatar.step4,
  5: assets.tutorial.avatar.step5,
}

interface AvatarTutorialModalProps {
  visible: boolean
  onClose: () => void
}

/**
 * Avatar tutorial
 * Appears when user asks for tutorial in edit avatar screen.
 */
export const AvatarTutorialModal = ({ visible, onClose }: AvatarTutorialModalProps) => {
  const [currentStep, setCurrentStep] = React.useState(1)
  const { width } = useResponsive()
  const { modalBackdropColor } = useColor()
  const styles = createAvatarTutorialModalStyles(width)
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
          title: "Let's start building your friend!",
          text: [
            'Tap the buttons (Body, Hair, Eyes, Clothes, and Devices) to start creating your Oky friend.',
            'You can jump between buttons anytime and see changes right away!',
          ],
        }
      case 2:
        return {
          title: 'Pick colors.',
          text: [
            'Tap the color circles to change your friend\'s skin, hair, or eye color.',
            'Use the arrows or swipe left or right to see more options and tap to select color circles for changing skin, hair, or eye colors.',
          ],
        }
      case 3:
        return {
          title: 'Exploring the options',
          text: [
            'Swipe the tiles to the right or left or tap the arrows to see more options.',
            'Tap the tile you want to select and you can see it in your avatar right away!',
          ],
        }
      case 4:
        return {
          title: 'Devices.',
          text: [
            'Add fun extras to make your Oky friend stand out!',
            'Select all the accessories you would like to add.',
          ],
        }
      case 5:
        return {
          title: 'All done?',
          text: [
            'Tap "Save your friend" to save your Oky friend.',
            'Tap Exit if you want to leave. Your progress won\'t be saved, but don\'t worry, you can always come back and change your avatar again later.',
          ],
        }
      default:
        return { title: '', text: [] }
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
            <Button onPress={handleBack} style={styles.backButton}>
              <FontAwesome size={12} name={'arrow-left'} color={'#fff'} />
            </Button>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>How to build your friend</Text>
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
            <Text style={styles.instructionsTitle}>{stepContent.title}</Text>
            {stepContent.text.map((line, index) => (
              <Text key={index} style={styles.instructionsText}>
                {line}
              </Text>
            ))}
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
            <TouchableOpacity onPress={handleBack} style={[styles.navButton, styles.navButtonBack]}>
              <Text style={styles.navButtonTextBack}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext} style={[styles.navButton, styles.navButtonNext]}>
              <Text style={styles.navButtonTextNext}>
                {currentStep === totalSteps ? 'Finish' : 'Next'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Skip Tutorial Link */}
          <TouchableOpacity onPress={handleSkip} style={styles.skipContainer}>
            <Text style={styles.skipText}>Skip tutorial</Text>
          </TouchableOpacity>
        </View>
      </View>
    </RNModal>
  )
}

