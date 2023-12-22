import * as React from 'react'
import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native'
import Animated from 'react-native-reanimated'
import { approximates, runSpring } from 'react-native-redash'
import { useTheme } from '../../../components/context/ThemeContext'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { assets } from '../../../assets/index'
import { translate } from '../../../i18n'
import { useCommonSelector } from 'react-redux'
import { commonSelectors } from '../../../redux/common/selectors'
import moment from 'moment'
import {
  useTodayPrediction,
  useActualCurrentStartDateSelector,
} from '../../../components/context/PredictionProvider'
import _ from 'lodash'

const {
  Value,
  useCode,
  cond,
  Clock,
  and,
  set,
  add,
  not,
  clockRunning,
  block,
  stopClock,
  interpolate,
} = Animated

const heightOfScreen = Dimensions.get('window').height

function checkForVerifiedDay(cardValues) {
  if (_.has(cardValues, 'periodDay')) {
    return cardValues.periodDay
  }
  return false
}

function useStatusForSource(
  data,
  themeName,
  cardValues,
  hasFuturePredictionActive,
  currentCycleInfo,
  actualCurrentStartDate,
) {
  const isVerified = checkForVerifiedDay(cardValues)
  const themeIcon = switcher(themeName)
  let isFutureDate = null
  if (hasFuturePredictionActive) {
    if (!hasFuturePredictionActive?.futurePredictionStatus) {
      if (!_.isEmpty(actualCurrentStartDate)) {
        const checkStartDate = actualCurrentStartDate?.cycleStart
          ? actualCurrentStartDate.cycleStart
          : actualCurrentStartDate?.startDate
        isFutureDate = moment(data.date).isAfter(
          moment(checkStartDate).add(actualCurrentStartDate.periodLength, 'days'),
        )
      }
    }
    if (isFutureDate) {
      return assets.static.icons[themeIcon].nonPeriod
    }
  }

  if (data.onPeriod && isVerified) return assets.static.icons[themeIcon].period
  if (data.onPeriod && !isVerified) return assets.static.icons[themeIcon].notVerifiedDay
  if (data.onFertile) return assets.static.icons[themeIcon].fertile

  return assets.static.icons[themeIcon].nonPeriod
}

function switcher(value) {
  switch (value) {
    case 'mosaic':
      return 'stars'
    case 'desert':
      return 'segment'
    default:
      return 'clouds'
  }
}

export function CircularElement({
  radius,
  isActive,
  index,
  currentIndex,
  dataEntry,
  segment,
  cardValues,
  state,
}) {
  const currentCycleInfo = useTodayPrediction()
  const hasFuturePredictionActive = useCommonSelector(commonSelectors.isFuturePredictionSelector)
  const actualCurrentStartDate = useActualCurrentStartDateSelector()
  const { id: themeName } = useTheme()
  const clock = new Clock()
  const value = new Value(0)
  const margin = themeName === 'desert' ? 0 : 10 // No margin for the continuos circle

  useCode(
    block([
      cond(and(not(isActive), approximates(index, currentIndex)), [
        set(value, runSpring(clock, 0, 1)),
        cond(not(clockRunning(clock)), set(isActive, 0)),
      ]),
      cond(isActive, [stopClock(clock), set(value, 0)]),
    ]),
    [],
  )
  const scale = interpolate(value, {
    inputRange: [0, 1],
    outputRange: [1, 1.3],
  })

  const InnerRotateZ = interpolate(index, {
    inputRange: [0, 12],
    outputRange: [0, 2 * Math.PI],
  })
  const source = useStatusForSource(
    dataEntry,
    themeName,
    cardValues,
    hasFuturePredictionActive,
    currentCycleInfo,
    actualCurrentStartDate,
  )
  const cloudAdjust = themeName !== 'mosaic' && themeName !== 'desert' ? { left: -3 } : null
  let isFutureDate = null
  if (hasFuturePredictionActive) {
    if (!hasFuturePredictionActive?.futurePredictionStatus) {
      if (!_.isEmpty(actualCurrentStartDate)) {
        const checkStartDate = actualCurrentStartDate?.cycleStart
          ? actualCurrentStartDate.cycleStart
          : actualCurrentStartDate?.startDate
        isFutureDate = moment(dataEntry.date).isAfter(
          moment(checkStartDate).add(actualCurrentStartDate.periodLength, 'days'),
        )
      }
    }
  }

  return (
    <View
      style={{
        width: radius * 2,
        height: radius * 2,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Animated.View
        // @ts-ignore
        style={{
          width: (radius - margin) * 2,
          height: (radius - margin) * 2,
          justifyContent: 'center',
          alignItems: 'center',
          transform: [
            {
              scale: themeName === 'desert' ? 1 : scale,
              rotateZ:
                themeName === 'desert'
                  ? '-0.2deg'
                  : add(InnerRotateZ, new Value(-currentIndex * segment + 0.5 * Math.PI)),
            },
          ],
        }}
      >
        <TouchableOpacity
          accessibilityLabel={`${dataEntry.date.format('DD')}\n${translate(
            dataEntry.date.format('MMM'),
          )}`}
          onPress={() => null}
        >
          <ImageBackground
            style={{
              width: themeName === 'desert' ? 0.15 * heightOfScreen : 70,
              height: themeName === 'desert' ? 0.15 * heightOfScreen : 70,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            resizeMode="contain"
            source={source}
          >
            <Animated.Text
              style={[
                // @ts-ignore
                themeName === 'desert' && {
                  transform: [
                    {
                      rotateZ: add(
                        InnerRotateZ,
                        new Value(-currentIndex * segment + 0.5 * Math.PI),
                      ),
                    },
                  ],
                },
                {
                  width: '100%',
                  alignItems: 'center',
                  textAlign: 'center',
                  color: isFutureDate
                    ? 'white'
                    : dataEntry.onPeriod && !checkForVerifiedDay(cardValues)
                    ? '#e3629b'
                    : 'white',
                  fontSize: 11,
                  fontFamily: 'Roboto-Black',
                },
                themeName !== 'desert' && {
                  right: -2,
                },
                cloudAdjust,
              ]}
            >
              {`${dataEntry.date.format('DD')}\n${translate(dataEntry.date.format('MMM'))}`}
            </Animated.Text>
          </ImageBackground>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}
