import React from 'react'
import { StyleSheet, View } from 'react-native'
import { GestureDetector } from 'react-native-gesture-handler'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'
import { DailyCard } from '../../../components/DailyCard'
import { DayData, useDayScroll } from '../DayScrollContext'

export const Carousel = () => {
  const { data, carouselPanGesture, constants } = useDayScroll()

  return (
    <GestureDetector gesture={carouselPanGesture}>
      <View style={[styles.container, { marginLeft: constants.CARD_SCALED_DIFFERENCE }]}>
        {data.map((item, i) => {
          return <CarouselCard key={`${item}${i}`} index={i} item={item} />
        })}
      </View>
    </GestureDetector>
  )
}

const CarouselCard = ({ index, item }: { index: number; item: DayData }) => {
  const {
    translationX,
    constants,
    offset,
    totalOffset,
    selectedScale,
    selectedIndex,
  } = useDayScroll()

  const { FULL_CARD_WIDTH, NUMBER_OF_BUTTONS } = constants

  const isSelected = index === selectedIndex?.value

  const carouselAnimatedStyle = useAnimatedStyle(() => {
    if (
      offset === null ||
      totalOffset === null ||
      translationX === null ||
      selectedScale === null ||
      selectedIndex === null
    ) {
      return {}
    }

    const selected = index === selectedIndex?.value

    const shouldMove =
      index < (offset.value < 0 ? NUMBER_OF_BUTTONS + offset.value : offset.value) ? 1 : 0
    const multiplier = Math.floor(totalOffset.value / NUMBER_OF_BUTTONS) + shouldMove
    const translateX = translationX.value + FULL_CARD_WIDTH * NUMBER_OF_BUTTONS * multiplier

    const scale = selected ? selectedScale.value : 1

    return {
      transform: [{ translateX }, { scale }],
      zIndex: selected ? 2 : 1,
    }
  })

  return (
    <Animated.View style={[carouselAnimatedStyle]}>
      <DailyCard dataEntry={item} disabled={!isSelected} />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
