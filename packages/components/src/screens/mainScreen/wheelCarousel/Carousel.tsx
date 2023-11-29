import * as React from 'react'
import { View, StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'
import { CarouselElement } from './CarouselElement'
import { PanGesture } from './PanGesture'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { navigate, navigateAndReset } from '../../../services/navigationService'
import moment from 'moment'
import { useDisplayText } from '../../../components/context/DisplayTextContext'
import { useSelector } from '../../../hooks/useSelector'
import * as selectors from '../../../redux/selectors'
import { SpinLoader } from '../../../components/common/SpinLoader'
import { useScreenDimensions } from '../../../hooks/useScreenDimensions'

export function Carousel({
  data,
  index,
  isActive,
  currentIndex,
  absoluteIndex,
  disableInteraction = false,
  showOverlay = false,
}) {
  const { screenWidth, screenHeight } = useScreenDimensions()

  let cardWidth = 0.5 * screenWidth
  let cardHeight = 0.2 * screenHeight

  const maxCardWidth = 320
  const aspectRatio = 0.7

  if (cardWidth > maxCardWidth) {
    cardWidth = maxCardWidth
    cardHeight = cardWidth * aspectRatio
  }

  const { interpolate, Value } = Animated
  const width = cardWidth + 40
  let translateX = new Value(0)

  const isTutorialTwoOn = useSelector(selectors.isTutorialTwoActiveSelector)
  const [isVisible, setIsVisible] = React.useState(false)
  const { setDisplayTextStatic } = useDisplayText()

  return (
    <>
      <View
        style={[
          { height: '100%', width: '100%' },
          showOverlay && { backgroundColor: 'rgba(0,0,0,0.8)' },
        ]}
      >
        {data.map((dataEntry, key) => {
          // The following is for the 0 index and 1 index being moved so that a linear list appears to be infinite.
          if (key === 0) {
            // @ts-ignore
            translateX = interpolate(index, {
              inputRange: [0, 1, 2, 2, 3, 10, data.length - 1, data.length],
              outputRange: [0, -width, -2 * width, 2 * width, 2 * width, 2 * width, width, 0],
            })
          } else if (key === 1) {
            // @ts-ignore
            translateX = interpolate(index, {
              inputRange: [0, 1, 2, 2, data.length - 1, data.length],
              outputRange: [width, 0, -width, 2 * width, 2 * width, width],
            })
          } else {
            // @ts-ignore
            translateX = interpolate(index, {
              inputRange: [key - 1, key, key + 1],
              outputRange: [width, 0, -width],
            })
          }

          return (
            <Animated.View
              // @ts-ignore
              style={[
                StyleSheet.absoluteFillObject,
                // @ts-ignore
                { transform: [{ translateX }] },
                { left: -cardWidth / 1.8 },
              ]}
              {...{ key }}
            >
              <CarouselElement
                index={index}
                dataEntry={dataEntry}
                isActive={isActive}
                currentIndex={key}
                width={cardWidth}
                height={cardHeight}
                showOverlay={showOverlay}
              />
            </Animated.View>
          )
        })}
        {!disableInteraction && (
          <PanGesture isX={true} ratio={width} {...{ isActive, absoluteIndex }}>
            <TouchableOpacity
              onPress={() => {
                if (isTutorialTwoOn) {
                  setIsVisible(true)
                  requestAnimationFrame(() => {
                    navigateAndReset('TutorialSecondStack', null)
                  })
                  return
                }
                data[currentIndex].date.diff(moment().startOf('day'), 'days') <= 0
                  ? navigate('DayScreen', { data: data[currentIndex] })
                  : setDisplayTextStatic('carousel_no_access')
              }}
              style={{
                height: cardHeight * 1.2,
                width: cardWidth * 1.2,
                borderRadius: 10,
                bottom: -10,
                left: 15,
              }}
            />
          </PanGesture>
        )}
      </View>
      <SpinLoader isVisible={isVisible} setIsVisible={setIsVisible} text="please_wait_tutorial" />
    </>
  )
}
