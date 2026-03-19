import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'
import Animated, {
  useSharedValue,
  cancelAnimation,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated'
import { AvatarPreview, AvatarPreviewProps } from './index'

// Extract just the props we need (excluding animatedTransforms since we'll add our own)
type BaseAvatarPreviewProps = Omit<AvatarPreviewProps, 'animatedTransforms'>

/**
 * Animated version of AvatarPreview that applies the combined animation sequence
 * from the HTML test file. The animation loops infinitely and starts automatically
 * when the component mounts.
 * 
 * Note: This applies transforms to the entire avatar. For more granular control
 * (individual body parts), the AvatarPreview component would need to be modified
 * to support animated transforms on individual layers.
 */
export const AnimatedAvatarPreview: React.FC<BaseAvatarPreviewProps> = (props) => {
  // Animation values for different body parts
  const eyeX = useSharedValue(0)
  const jumpY = useSharedValue(0) // Root SVG jump animation
  const leftHandRotation = useSharedValue(0)
  const rightHandRotation = useSharedValue(0)
  const leftLegScaleY = useSharedValue(1)
  const rightLegScaleY = useSharedValue(1)

  // Start animation whenever the screen is focused (page opened)
  // This ensures animations restart every time the user navigates to the page
  const startAnimations = React.useCallback(() => {
    // Cancel any existing animations
    cancelAnimation(eyeX)
    cancelAnimation(jumpY)
    cancelAnimation(leftHandRotation)
    cancelAnimation(rightHandRotation)
    cancelAnimation(leftLegScaleY)
    cancelAnimation(rightLegScaleY)
    
    // Small delay to ensure component is fully rendered
    const startAnimation = setTimeout(() => {
      try {
        // Reset all values
        eyeX.value = 0
        jumpY.value = 0
        leftHandRotation.value = 0
        rightHandRotation.value = 0
        leftLegScaleY.value = 1
        rightLegScaleY.value = 1

      // Calculate durations for the sequence
      const eyesDuration = 400 + 2000 + 400 + 2000 + 400 // 5.2s
      const jumpDuration = 800 + 800 // 1.6s
      const leftHandDuration = 300 + 200 + 500 + 300 + 200 + 500 // 2s
      const rightHandDuration = 300 + 200 + 500 + 300 + 200 + 500 // 2s
      const pauseBetween = 1000 // 1s pause between animations
      
      // Total sequence duration: eyes + pause + jump + pause + leftHand + pause + rightHand
      const totalSequenceDuration = eyesDuration + pauseBetween + jumpDuration + pauseBetween + leftHandDuration + pauseBetween + rightHandDuration
      // Total: 5.2s + 1s + 1.6s + 1s + 2s + 1s + 2s = 13.8s
      
      // 1. Eyes animation: look left, stay, look right, stay, return to center
      // Then wait for the rest of the sequence to complete before repeating
      const eyesSequence = withSequence(
        // Look left (0.4s)
        withTiming(-3, { duration: 400, easing: Easing.inOut(Easing.sin) }),
        // Stay looking left (2s)
        withTiming(-3, { duration: 2000, easing: Easing.linear }),
        // Look right (0.4s)
        withTiming(3, { duration: 400, easing: Easing.inOut(Easing.sin) }),
        // Stay looking right (2s)
        withTiming(3, { duration: 2000, easing: Easing.linear }),
        // Return to center (0.4s)
        withTiming(0, { duration: 400, easing: Easing.inOut(Easing.sin) }),
        // Wait 1s before next animation
        withTiming(0, { duration: pauseBetween, easing: Easing.linear }),
        // Wait for rest of sequence (jump + pause + leftHand + pause + rightHand)
        withTiming(0, { duration: jumpDuration + pauseBetween + leftHandDuration + pauseBetween + rightHandDuration, easing: Easing.linear }),
      )
      eyeX.value = withRepeat(eyesSequence, -1, false) // Repeat infinitely

      // 2. Jump animation: starts after eyes animation + 1s wait
      // Body moves up and down, legs scale down/up simultaneously
      const jumpSequence = withSequence(
        // Jump up (0.8s) - body moves up (smaller jump)
        withTiming(-15, { duration: 800, easing: Easing.out(Easing.quad) }),
        // Come back down (0.8s) - body moves down
        withTiming(0, { duration: 800, easing: Easing.in(Easing.quad) }),
        // Wait 1s before next animation
        withTiming(0, { duration: pauseBetween, easing: Easing.linear }),
        // Wait for rest of sequence (leftHand + pause + rightHand + eyes + pause)
        withTiming(0, { duration: leftHandDuration + pauseBetween + rightHandDuration + eyesDuration + pauseBetween, easing: Easing.linear }),
      )
      jumpY.value = withDelay(
        eyesDuration + pauseBetween, // After eyes + 1s wait
        withRepeat(jumpSequence, -1, false) // Repeat infinitely
      )

      // Legs scale down/up simultaneously with jump - perfectly synchronized
      // Scale down as body moves up (0.8s), scale up as body moves down (0.8s)
      // Very small knee bend
      const leftLegSequence = withSequence(
        // Scale down as body jumps up (0.8s - same duration as jump up, very small bend)
        withTiming(0.95, { duration: 800, easing: Easing.out(Easing.quad) }),
        // Scale up as body comes down (0.8s - same duration as jump down)
        withTiming(1, { duration: 800, easing: Easing.in(Easing.quad) }),
        withTiming(1, { duration: pauseBetween, easing: Easing.linear }), // Wait 1s
        // Wait for rest of sequence (same as jump)
        withTiming(1, { duration: leftHandDuration + pauseBetween + rightHandDuration + eyesDuration + pauseBetween, easing: Easing.linear }),
      )
      leftLegScaleY.value = withDelay(
        eyesDuration + pauseBetween, // Same delay as jump - starts at exact same time
        withRepeat(leftLegSequence, -1, false) // Repeat infinitely, perfectly synchronized with jump
      )
      
      const rightLegSequence = withSequence(
        // Scale down as body jumps up (0.8s - same duration as jump up, very small bend)
        withTiming(0.95, { duration: 800, easing: Easing.out(Easing.quad) }),
        // Scale up as body comes down (0.8s - same duration as jump down)
        withTiming(1, { duration: 800, easing: Easing.in(Easing.quad) }),
        withTiming(1, { duration: pauseBetween, easing: Easing.linear }), // Wait 1s
        // Wait for rest of sequence (same as jump)
        withTiming(1, { duration: leftHandDuration + pauseBetween + rightHandDuration + eyesDuration + pauseBetween, easing: Easing.linear }),
      )
      rightLegScaleY.value = withDelay(
        eyesDuration + pauseBetween, // Same delay as jump - starts at exact same time
        withRepeat(rightLegSequence, -1, false) // Repeat infinitely, perfectly synchronized with jump
      )

      // 3. Left hand wave: starts after jump + 1s wait
      // Left hand waves to the left (positive rotation in SVG = clockwise = to the left)
      const leftHandSequence = withSequence(
        // First wave - wave to the left
        withTiming(90, { duration: 300, easing: Easing.inOut(Easing.sin) }),
        withTiming(90, { duration: 200, easing: Easing.linear }),
        withTiming(0, { duration: 500, easing: Easing.inOut(Easing.sin) }),
        // Second wave - wave to the left
        withTiming(90, { duration: 300, easing: Easing.inOut(Easing.sin) }),
        withTiming(90, { duration: 200, easing: Easing.linear }),
        withTiming(0, { duration: 500, easing: Easing.inOut(Easing.sin) }),
        // Wait 1s before next animation
        withTiming(0, { duration: pauseBetween, easing: Easing.linear }),
        // Wait for rest of sequence (rightHand + eyes + pause + jump + pause)
        withTiming(0, { duration: rightHandDuration + eyesDuration + pauseBetween + jumpDuration + pauseBetween, easing: Easing.linear }),
      )
      leftHandRotation.value = withDelay(
        eyesDuration + pauseBetween + jumpDuration + pauseBetween, // After eyes + wait + jump + wait
        withRepeat(leftHandSequence, -1, false) // Repeat infinitely
      )

      // 4. Right hand wave: starts after left hand + 1s wait
      // Right hand waves to the right (negative rotation in SVG = counter-clockwise = to the right)
      const rightHandSequence = withSequence(
        // First wave - wave to the right
        withTiming(-90, { duration: 300, easing: Easing.inOut(Easing.sin) }),
        withTiming(-90, { duration: 200, easing: Easing.linear }),
        withTiming(0, { duration: 500, easing: Easing.inOut(Easing.sin) }),
        // Second wave - wave to the right
        withTiming(-90, { duration: 300, easing: Easing.inOut(Easing.sin) }),
        withTiming(-90, { duration: 200, easing: Easing.linear }),
        withTiming(0, { duration: 500, easing: Easing.inOut(Easing.sin) }),
        // Wait for rest of sequence (eyes + pause + jump + pause + leftHand + pause)
        withTiming(0, { duration: eyesDuration + pauseBetween + jumpDuration + pauseBetween + leftHandDuration + pauseBetween, easing: Easing.linear }),
      )
      rightHandRotation.value = withDelay(
        eyesDuration + pauseBetween + jumpDuration + pauseBetween + leftHandDuration + pauseBetween, // After all previous + waits
        withRepeat(rightHandSequence, -1, false) // Repeat infinitely
      )
    } catch (error) {
      // Silently handle animation errors
    }
    }, 500) // Small delay to ensure component is mounted

      return () => {
        clearTimeout(startAnimation)
      }
    }, [eyeX, jumpY, leftHandRotation, rightHandRotation, leftLegScaleY, rightLegScaleY])

  // Start animations when component mounts
  React.useEffect(() => {
    startAnimations()
  }, [startAnimations])

  // Restart animations whenever the screen is focused (page opened)
  // Stop animations when screen is unfocused (user navigates away)
  useFocusEffect(
    React.useCallback(() => {
      startAnimations()
      
      return () => {
        // Cancel all animations when leaving the screen
        cancelAnimation(eyeX)
        cancelAnimation(jumpY)
        cancelAnimation(leftHandRotation)
        cancelAnimation(rightHandRotation)
        cancelAnimation(leftLegScaleY)
        cancelAnimation(rightLegScaleY)
        // Reset all values to their default state
        eyeX.value = 0
        jumpY.value = 0
        leftHandRotation.value = 0
        rightHandRotation.value = 0
        leftLegScaleY.value = 1
        rightLegScaleY.value = 1
      }
    }, [startAnimations, eyeX, jumpY, leftHandRotation, rightHandRotation, leftLegScaleY, rightLegScaleY])
  )

  // Prepare animated transforms object to pass to AvatarPreview
  // jumpY applies to root SVG of all components so everything jumps together
  const animatedTransforms = React.useMemo(() => {
    return {
      jumpY: jumpY, // Applied to root SVG of all components
      leftLeg: { scaleY: leftLegScaleY }, // Only scale for legs during jump
      rightLeg: { scaleY: rightLegScaleY }, // Only scale for legs during jump
      leftHand: { rotation: leftHandRotation }, // Only rotation, no translation (hands stay fixed at shoulder)
      rightHand: { rotation: rightHandRotation }, // Only rotation, no translation (hands stay fixed at shoulder)
      eyes: { translateX: eyeX },
    }
  }, [eyeX, jumpY, leftHandRotation, rightHandRotation, leftLegScaleY, rightLegScaleY])

  return (
    <View style={styles.container}>
      <AvatarPreview {...props} animatedTransforms={animatedTransforms} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // Container for animated avatar
  },
})
