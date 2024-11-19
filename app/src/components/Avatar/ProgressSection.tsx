import React from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import Ionicons from '@expo/vector-icons/Ionicons'
import { cardAnswerSelector } from '../../redux/selectors'
import moment from 'moment'
import { useSelector } from '../../redux/useSelector'
import { ProgressBar } from './ProgressBar'
import { SharedValue, runOnJS, useAnimatedReaction } from 'react-native-reanimated'
import { HeartAnimation } from './HeartAnimation'
import { useResponsive } from '../../contexts/ResponsiveContext'
import { useColor } from '../../hooks/useColor'

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
  const { UIConfig } = useResponsive()
  const { palette, starColor } = useColor()

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

  const bottom = lottieHeight / 10
  const backgroundColor = '#fff'

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          bottom,
        },
        style,
      ]}
      pointerEvents={'none'}
    >
      {/* ===== Hearts ===== */}
      <View
        style={[
          styles.section,
          {
            marginVertical: UIConfig.progressSection.marginVertical,
          },
        ]}
      >
        <Ionicons
          name={getHeart(heartPercent)}
          color={palette.danger.base}
          size={UIConfig.progressSection.iconSize}
          style={styles.icon}
        />
        <ProgressBar
          color={palette.danger.base}
          value={heartPercent}
          height={UIConfig.progressSection.barHeight}
        />
      </View>

      {/* ===== Stars ===== */}
      <View
        style={[
          styles.section,
          {
            marginVertical: UIConfig.progressSection.marginVertical,
          },
        ]}
      >
        <FontAwesome
          name={getStar(Object.keys(cardAnswersToday).length)}
          color={starColor}
          size={UIConfig.progressSection.iconSize}
          style={styles.icon}
        />
        <ProgressBar
          color={starColor}
          value={starPercent}
          height={UIConfig.progressSection.barHeight}
        />
      </View>

      {/* ===== Animated hearts ===== */}
      <HeartAnimation count={progress} />
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
    backgroundColor: '#fff',
    padding: 2,
    borderRadius: 5,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 0,
  },
  icon: {
    marginRight: 4,
  },
})
