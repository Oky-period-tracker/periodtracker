import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle, Image } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Ionicons from '@expo/vector-icons/Ionicons'
import { cardAnswerSelector, currentAvatarSelector, currentUserSelector } from '../../redux/selectors'
import moment from 'moment'
import { useSelector } from '../../redux/useSelector'
import { ProgressBar } from './ProgressBar'
import { SharedValue, runOnJS, useAnimatedReaction } from 'react-native-reanimated'
import { HeartAnimation } from './HeartAnimation'
import { useResponsive } from '../../contexts/ResponsiveContext'
import { useColor } from '../../hooks/useColor'
import { AvatarLock } from '../AvatarLock'
import { getAsset } from '../../services/asset'

export const ProgressSection = ({
  heartProgress,
  lottieHeight,
  style,
}: {
  heartProgress: SharedValue<number>
  lottieHeight: number
  style?: StyleProp<ViewStyle>
}) => {
  const [progress, setProgress] = React.useState(0)
  const { UIConfig, width } = useResponsive()
  const { palette, starColor } = useColor()
  const currentAvatar = useSelector(currentAvatarSelector)
  const currentUser = useSelector(currentUserSelector)

  useAnimatedReaction(
    () => heartProgress.value,
    (currentHeartProgress) => {
      runOnJS(setProgress)(currentHeartProgress)
    },
    [heartProgress],
  )

  const heartPercent = Math.min(progress * 5, 100)

  const cardAnswersToday = useSelector((state) => cardAnswerSelector(state, moment.utc()))

  const starPercent = Math.min(Object.keys(cardAnswersToday).length * 25, 100)

  const backgroundColor = 'transparent'
  const scaleFactor = 0.85
  const scaledIconSize = UIConfig.progressSection.iconSize * scaleFactor
  const scaledBarHeight = UIConfig.progressSection.barHeight * scaleFactor
  const scaledMarginVertical = UIConfig.progressSection.marginVertical * scaleFactor

  const getProgressSectionBottom = (screenWidth: number, avatar: string): number => {
    // Special handling for oky avatar - adjust bottom position to keep it on top of clouds
    // Oky lottie file is smaller (0.85 scale) and has different aspect ratio, so container is shorter
    // Need to increase bottom value significantly to compensate for smaller container height
    if (avatar === 'oky') {
      if (screenWidth <= 360) return 35  // Increased to compensate for smaller container
      if (screenWidth <= 392) return 35  // Increased to compensate for smaller container
      if (screenWidth <= 411) return 30  // Increased to compensate for smaller container
      if (screenWidth <= 480) return 30  // Increased to compensate for smaller container
      if (screenWidth <= 600) return 30  // Increased to compensate for smaller container
      if (screenWidth <= 720) return 30  // Increased to compensate for smaller container
      return 50  // Increased to compensate for smaller container
    }
    
    // Default for other avatars
    if (screenWidth <= 360) return 35
    if (screenWidth <= 392) return 35
    if (screenWidth <= 411) return 35
    if (screenWidth <= 480) return 20
    if (screenWidth <= 600) return 25
    if (screenWidth <= 720) return 25
    return 35
  }

  const bottomValue = getProgressSectionBottom(width, currentAvatar)

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
        },
        style,
        {
          bottom: bottomValue, // Apply bottom after style to ensure it takes precedence
        },
      ]}
      pointerEvents={'none'}
    >
      {/* ===== Hearts ===== */}
      <View
        style={[
          styles.section,
          {
            marginVertical: scaledMarginVertical,
          },
        ]}
      >
        <Ionicons
          name={getHeart(heartPercent)}
          color={palette.danger.base}
          size={scaledIconSize}
          style={styles.icon}
        />
        <ProgressBar
          color={palette.danger.base}
          value={heartPercent}
          height={scaledBarHeight}
        />
      </View>

      {/* ===== Stars ===== */}
      <View
        style={[
          styles.section,
          {
            marginVertical: scaledMarginVertical,
          },
        ]}
      >
        <FontAwesome
          name={getStar(Object.keys(cardAnswersToday).length)}
          color={starColor}
          size={scaledIconSize}
          style={styles.icon}
        />
        <ProgressBar
          color={starColor}
          value={starPercent}
          height={scaledBarHeight}
        />
      </View>

      {/* ===== Animated hearts ===== */}
      <HeartAnimation count={progress} />

      {/* ===== Avatar Locks ===== */}
      <AvatarLock 
        cyclesNumber={currentUser?.cyclesNumber || 0}
        customAvatarUnlocked={currentUser?.avatar?.customAvatarUnlocked === true}
        style={styles.locksContainer}
      />
    </View>
  )
}

const getHeart = (numberOfElements: number) => {
  if (numberOfElements === null) return 'heart-outline'
  if (numberOfElements < 50) return 'heart-outline'
  if (numberOfElements < 100) return 'heart-half'
  if (numberOfElements >= 100) return 'heart'
  return 'heart-outline'
}

const getStar = (numberOfElements: number) => {
  if (numberOfElements === null) return 'star-o'
  if (numberOfElements < 2) return 'star-o'
  if (numberOfElements >= 2 && numberOfElements < 4) return 'star-half-full'
  if (numberOfElements >= 4) return 'star'
  return 'star-o'
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 1.5,
    borderRadius: 4,
    width: '90%',
    zIndex: 2,
    left: 2
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 0,
  },
  icon: {
    marginRight: 4,
  },
  locksContainer: {
    marginTop: 4,
  },
})
