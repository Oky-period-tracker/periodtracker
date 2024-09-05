import React from 'react'
import { View, StyleSheet, LayoutChangeEvent, PixelRatio } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { Button } from './Button'
import { globalStyles } from '../config/theme'

interface SwiperProps {
  index: number
  setIndex: (i: number) => void
  pages: React.ReactNode[]
  renderActionRight?: (currentPage: number, total: number) => React.ReactNode
}

export const Swiper = ({ index, setIndex, pages, renderActionRight }: SwiperProps) => {
  const [containerWidth, setContainerWidth] = React.useState(0)

  const onLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout
    setContainerWidth(width)
  }

  const fullWidth = containerWidth + marginRight
  const pixelRatio = PixelRatio.get()
  const threshold = containerWidth / pixelRatio / 3 // Drag 1/3 of card width to swipe

  const translationX = useSharedValue(0)
  const totalTranslationX = useSharedValue(0)

  const maxIndex = pages.length - 1

  const getSafeIndex = (i: number) => {
    'worklet'
    return Math.min(Math.max(i, 0), maxIndex)
  }

  const slideToPosition = (i: number) => {
    'worklet'
    const endX = -i * fullWidth
    totalTranslationX.value = endX
    translationX.value = withTiming(endX, {
      duration: SETTLE_DURATION,
    })
  }

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translationX.value = totalTranslationX.value + event.translationX
    })
    .onEnd((event) => {
      const passesThreshold = Math.abs(event.translationX) > threshold
      let indexChange = 0

      if (passesThreshold && event.translationX < 0) {
        indexChange = 1
      }

      if (passesThreshold && event.translationX > 0) {
        indexChange = -1
      }

      const nextIndex = index + indexChange
      const safeIndex = getSafeIndex(nextIndex)
      slideToPosition(safeIndex)
      runOnJS(setIndex)(safeIndex)
    })

  const handleIndicatorPress = (i: number) => {
    setIndex(i)
  }

  React.useEffect(() => {
    slideToPosition(index)
  }, [index])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translationX.value }],
    }
  })

  return (
    <View style={styles.container} onLayout={onLayout}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.pagesContainer, globalStyles.shadow, animatedStyle]}>
          {pages.map((page, i) => (
            <View key={i} style={[styles.page, globalStyles.shadow]}>
              {page}
            </View>
          ))}
        </Animated.View>
      </GestureDetector>

      <View style={styles.footer}>
        <View style={styles.footerAction} />
        {pages.map((_, i) => {
          const isSelected = i === index
          const onPress = () => handleIndicatorPress(i)

          return (
            <Button
              key={`indicator-${i}`}
              onPress={onPress}
              style={styles.indicator}
              status={isSelected ? 'danger' : 'basic'}
            />
          )
        })}
        <View style={styles.footerAction}>{renderActionRight?.(index, pages.length)}</View>
      </View>
    </View>
  )
}

const SETTLE_DURATION = 350

const marginRight = 12 // Same as <Screen> padding

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  pagesContainer: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    width: '100%',
    marginRight,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerAction: {
    flex: 1,
    height: '100%',
  },
  indicator: {
    width: 16,
    height: 16,
    margin: 8,
  },
})
