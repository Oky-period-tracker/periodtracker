import React from 'react'
import LottieView from 'lottie-react-native'
import { assets } from '../../resources/assets'
import { useDayScroll } from '../../screens/MainScreen/DayScrollContext'
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'
import { ProgressSection } from './ProgressSection'
import { useSelector } from 'react-redux'
import { currentAvatarSelector } from '../../redux/selectors'
import Animated, {
  runOnJS,
  useAnimatedProps,
  useAnimatedReaction,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { AvatarMessage } from './AvatarMessage'
import { getCustomAvatarStyles } from '../../optional/styles'

interface AnimationConfig {
  start: number
  end: number
  duration: number
}

const animationSequences: Record<string, AnimationConfig> = {
  lookingAndWave: { start: 0, end: 8 / 30, duration: 6500 },
  looking: { start: 0, end: 4 / 30, duration: 4000 },
  wave: { start: 4 / 30, end: 8 / 30, duration: 4000 },
  jump: { start: 8 / 30, end: 10 / 30, duration: 2200 },
  danceOne: { start: 10 / 30, end: 15 / 30, duration: 4000 },
  danceTwo: { start: 15 / 30, end: 20 / 30, duration: 4000 },
  danceThree: { start: 20 / 30, end: 25 / 30, duration: 5000 },
  danceFour: { start: 25 / 30, end: 30 / 30, duration: 5000 },
}

const dances = [
  animationSequences.danceOne,
  animationSequences.danceTwo,
  animationSequences.danceThree,
  // animationSequences.danceFour,
]

const defaultDance = animationSequences.danceFour

export const Avatar = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const avatar = useSelector(currentAvatarSelector)
  const { diameter } = useDayScroll()

  const isJumpingToggled = useSharedValue(false)
  const isDancingToggled = useSharedValue(false)
  const animatedHearts = useSharedValue(0)
  const progress = useSharedValue(0)

  const currentAnimation = useSharedValue(defaultDance)

  useAnimatedReaction(
    () => animatedHearts.value,
    (currentHeartProgress) => {
      const heartPercentage = Math.min(currentHeartProgress * 5, 100)
      if (heartPercentage >= 100) {
        isDancingToggled.value = true
      }
    },
    [animatedHearts],
  )

  const runInitialAnimation = (animation: AnimationConfig) => {
    progress.value = withRepeat(
      withSequence(
        withTiming(animation.start, { duration: 0 }),
        withTiming(animation.start, { duration: 3000 }),
        withTiming(animation.end, {
          duration: animation.duration,
        }),
        withTiming(animation.start, { duration: 0 }, (finished) => {
          if (finished) {
            runOnJS(runDynamicAnimation)()
          }
        }),
      ),
      -1,
    )
  }

  const runDynamicAnimation = () => {
    const current = { ...currentAnimation.value }

    progress.value = withSequence(
      withTiming(currentAnimation.value.start, { duration: 0 }),
      withTiming(
        currentAnimation.value.end,
        {
          duration: currentAnimation.value.duration,
        },
        (finished) => {
          if (finished) {
            if (current.start === currentAnimation.value.start) {
              isJumpingToggled.value = false
              isDancingToggled.value = false
            }
            runOnJS(runInitialAnimation)(animationSequences.lookingAndWave)
          }
        },
      ),
    )
  }

  useAnimatedReaction(
    () => [isJumpingToggled.value, isDancingToggled.value],
    ([jumpingToggled, dancingToggled]) => {
      if (dancingToggled) {
        const randomDanceIndex = Math.floor(Math.random() * (4 - 1))
        currentAnimation.value = dances[randomDanceIndex]
        return
      }

      if (jumpingToggled) {
        currentAnimation.value = animationSequences.jump
        return
      }

      currentAnimation.value = defaultDance
    },
    [isJumpingToggled, isDancingToggled],
  )

  React.useEffect(() => {
    runInitialAnimation(animationSequences.lookingAndWave)
  })

  const onPress = () => {
    isJumpingToggled.value = true
    animatedHearts.value += 1
  }

  const animatedProps = useAnimatedProps(() => ({
    progress: progress.value,
  }))

  const source = assets.lottie.avatars[avatar]
  const lottieAspectRatio = source.w / source.h
  const lottieWidth = diameter * 0.33 - 12
  const lottieHeight = lottieWidth / lottieAspectRatio

  // - Top half of lottie is empty space, +72 height of CircleProgress
  const marginTop = -lottieHeight / 1.75 + 72

  // Optional submodule style customisation
  const customStyle = getCustomAvatarStyles?.({ lottieHeight })?.[avatar]

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        style,
        {
          width: lottieWidth,
          height: lottieHeight,
          marginTop,
        },
        customStyle?.avatar,
      ]}
      activeOpacity={1}
    >
      <AvatarMessage style={customStyle?.avatarMessage} />
      <AnimatedLottieView
        resizeMode="contain"
        style={{ width: lottieWidth, height: lottieHeight }}
        source={source}
        animatedProps={animatedProps}
        autoPlay={false}
        loop={false}
      />
      <ProgressSection
        heartProgress={animatedHearts}
        lottieHeight={lottieHeight}
        style={customStyle?.progressSection}
      />
    </TouchableOpacity>
  )
}

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView)

const styles = StyleSheet.create({
  container: {
    marginLeft: 12,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
