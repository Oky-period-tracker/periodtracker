import React from 'react'
import LottieView from 'lottie-react-native'
import { assets } from '../../resources/assets'
import { useDayScroll } from '../../screens/MainScreen/DayScrollContext'
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle, Image, View } from 'react-native'
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
import { useAvatar } from '../../hooks/useAvatar'
import { AvatarPreview } from '../AvatarPreview'
import { AnimatedAvatarPreview } from '../AvatarPreview/AnimatedAvatarPreview'
import { useResponsive } from '../../contexts/ResponsiveContext'
import { getAvatarContainerStyle, getAvatarContainerBottomStyle, getCustomAvatarScaleStyle, getLottieViewStyle } from './Avatar.styles'

const AVATAR_CONFIG = {
  baseWidthOffset: 12,
  marginTopBase: 72,
  marginTopAdjustment: 20,
  heightDivisor: 1.75,
} as const

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

const getSizeMultiplier = (screenWidth: number): number => {
  if (screenWidth <= 360) return 0.20
  if (screenWidth <= 392) return 0.22
  if (screenWidth <= 411) return 0.23
  if (screenWidth <= 480) return 0.22
  if (screenWidth <= 600) return 0.26
  if (screenWidth <= 720) return 0.27
  return 0.28
}



const getCustomAvatarScale = (screenWidth: number): number => {
  if (screenWidth <= 360) return 0.70
  if (screenWidth <= 392) return 0.72
  if (screenWidth <= 411) return 0.75
  if (screenWidth <= 480) return 0.72
  if (screenWidth <= 600) return 0.80
  if (screenWidth <= 720) return 0.82
  return 0.85
}

const getMaxWidth = (screenWidth: number): number | undefined => {
  if (screenWidth > 480 && screenWidth <= 600) return 105
  if (screenWidth > 600 && screenWidth <= 720) return 110
  if (screenWidth > 720) return 120
  return undefined
}

const getMarginTopOffset = (screenWidth: number): number => {
  if (screenWidth <= 360) return -25
  if (screenWidth <= 392) return -22
  if (screenWidth <= 411) return -20
  if (screenWidth <= 480) return -15
  if (screenWidth <= 600) return -10
  if (screenWidth <= 720) return -5
  return 0
}

const getAvatarBottomOffset = (screenWidth: number): number => {
  if (screenWidth <= 360) return -55
  if (screenWidth <= 392) return -38
  if (screenWidth <= 411) return -43
  if (screenWidth <= 480) return -80
  if (screenWidth <= 600) return -50
  if (screenWidth <= 720) return -50
  return -51
}

const getLottieBottomOffset = (screenWidth: number): number => {
  if (screenWidth <= 360) return -40
  if (screenWidth <= 392) return -33
  if (screenWidth <= 411) return -30
  if (screenWidth <= 480) return -65
  if (screenWidth <= 600) return -50
  if (screenWidth <= 720) return -50
  return -22
}

const getOkyBottomOffset = (screenWidth: number): number => {
  // Reduce spacing between oky avatar and ProgressSection
  if (screenWidth <= 360) return 0  // Less negative = closer to ProgressSection
  if (screenWidth <= 392) return 0
  if (screenWidth <= 411) return 0
  if (screenWidth <= 480) return 0
  if (screenWidth <= 600) return 0
  if (screenWidth <= 720) return 0
  return 0
}

const getOkyScaleFactor = (screenWidth: number): number => {
  // Custom responsive scaling for oky avatar per screen size
  if (screenWidth <= 360) return 1
  if (screenWidth <= 392) return 1
  if (screenWidth <= 411) return 0.9
  if (screenWidth <= 480) return 0.7
  if (screenWidth <= 600) return 0.9
  if (screenWidth <= 720) return 0.85
  return 0.8
}

export const Avatar = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const avatar = useSelector(currentAvatarSelector)
  const { diameter } = useDayScroll()
  const avatarPreviewData = useAvatar()
  const { width } = useResponsive()

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
  }, [])

  const onPress = () => {
    isJumpingToggled.value = true
    animatedHearts.value += 1
  }

  const animatedProps = useAnimatedProps(() => ({
    progress: progress.value,
  }))

  const source = assets.lottie.avatars[avatar]
  const lottieAspectRatio = source.w / source.h

  const isFriendAvatar = avatar === 'friend'
  const isCustomAvatar = isFriendAvatar && avatarPreviewData !== null

  const sizeMultiplier = getSizeMultiplier(width)
  const baseWidth = diameter * sizeMultiplier - AVATAR_CONFIG.baseWidthOffset
  const maxWidth = getMaxWidth(width)
  let lottieWidth = maxWidth ? Math.min(baseWidth, maxWidth) : baseWidth
  
  // Apply custom responsive scaling for oky avatar
  if (avatar === 'oky') {
    const okyScaleFactor = getOkyScaleFactor(width)
    lottieWidth = lottieWidth * okyScaleFactor
  }
  
  const lottieHeight = lottieWidth / lottieAspectRatio

  const marginTopOffset = getMarginTopOffset(width)
  const marginTop =
    -lottieHeight / AVATAR_CONFIG.heightDivisor +
    AVATAR_CONFIG.marginTopBase -
    AVATAR_CONFIG.marginTopAdjustment +
    marginTopOffset

  const avatarBottomOffset = getAvatarBottomOffset(width)
  // Use specific bottom offset for oky to reduce spacing, otherwise use default
  const lottieBottomOffset = avatar === 'oky' ? getOkyBottomOffset(width) : getLottieBottomOffset(width)
  const customAvatarScale = getCustomAvatarScale(width)

  // Optional submodule style customisation
  const customStyle = getCustomAvatarStyles?.({ lottieHeight })?.[avatar]

  const PROGRESS_SECTION_HEIGHT = 80
  const containerHeight = lottieHeight + PROGRESS_SECTION_HEIGHT

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        style,
        getAvatarContainerStyle(lottieWidth, containerHeight, marginTop),
        customStyle?.avatar,
      ]}
      activeOpacity={1}
    >
      <View style={styles.cloudsWrapper}>
        <Image
          source={assets.static.clouds}
          style={styles.cloudsBackground}
          resizeMode="contain"
        />
      </View>
      <View style={[styles.avatarContainer, getAvatarContainerBottomStyle(isCustomAvatar ? avatarBottomOffset : lottieBottomOffset)]}>
        <AvatarMessage style={customStyle?.avatarMessage} />
        {isCustomAvatar && avatarPreviewData ? (
          <View style={getCustomAvatarScaleStyle(customAvatarScale)}>
            <AnimatedAvatarPreview
              bodyType={avatarPreviewData.bodyType}
              skinColor={avatarPreviewData.skinColor}
              hairStyle={avatarPreviewData.hairStyle}
              hairColor={avatarPreviewData.hairColor}
              eyeShape={avatarPreviewData.eyeShape}
              eyeColor={avatarPreviewData.eyeColor}
              smile={avatarPreviewData.smile}
              clothing={avatarPreviewData.clothing}
              devices={avatarPreviewData.devices}
              width={lottieWidth}
              height={lottieHeight}
            />
          </View>
        ) : (
          <AnimatedLottieView
            resizeMode="contain"
            style={getLottieViewStyle(lottieWidth, lottieHeight)}
            source={source}
            animatedProps={animatedProps}
            autoPlay={false}
            loop={false}
          />
        )}
      </View>
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
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    position: 'relative',
  },
  avatarContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    zIndex: 3,
  },
  cloudsWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cloudsBackground: {
    width: '100%',
    maxHeight: '100%',
  },
})
