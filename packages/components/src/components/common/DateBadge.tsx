import React from 'react'
import { assets } from '../../assets/index'
import styled from 'styled-components/native'
import { useTheme } from '../context/ThemeContext'
import { translate } from '../../i18n'
import { TouchableOpacity } from 'react-native'
import _ from 'lodash'
import moment from 'moment'
import { commonSelectors } from '../../redux/common/selectors'
import {
  useTodayPrediction,
  useActualCurrentStartDateSelector,
} from '../../components/context/PredictionProvider'
import { useCommonSelector } from '../../redux/common/useCommonSelector'

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
      if (isFutureDate) {
        return assets.static.icons[themeIcon].nonPeriod
      }
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
      return 'circles'
    default:
      return 'clouds'
  }
}

export function DateBadge({ dataEntry, style, textStyle = null, showModal, cardValues }) {
  const { id: themeName } = useTheme()
  const currentCycleInfo = useTodayPrediction()
  const actualCurrentStartDate = useActualCurrentStartDateSelector()
  const hasFuturePredictionActive = useCommonSelector(commonSelectors.isFuturePredictionSelector)

  const source = useStatusForSource(
    dataEntry,
    themeName,
    cardValues,
    hasFuturePredictionActive,
    currentCycleInfo,
    actualCurrentStartDate,
  )
  const cloudAdjust =
    themeName !== 'mosaic' && themeName !== 'desert' ? { left: -3 } : { fontSize: 8, right: -2 }

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
    <TouchableOpacity
      accessibilityLabel={`${dataEntry.date.format('DD')}\n${translate(
        dataEntry.date.format('MMM'),
      )}`}
      onPress={() => {
        showModal()
      }}
    >
      <Background
        resizeMode="contain"
        style={[
          style,
          themeName === 'mosaic' && { height: 52, width: 52 },
          themeName === 'desert' && { height: 40, width: 40 },
        ]}
        source={source}
      >
        <DateText
          style={[
            textStyle,
            cloudAdjust,
            {
              color: isFutureDate
                ? 'white'
                : dataEntry.onPeriod && !checkForVerifiedDay(cardValues)
                ? '#e3629b'
                : 'white',
            },
          ]}
        >
          {`${dataEntry.date.format('DD')}\n${translate(dataEntry.date.format('MMM'))}`}
        </DateText>
      </Background>
    </TouchableOpacity>
  )
}

const Background = styled.ImageBackground`
  width: 55px;
  justify-content: center;
  align-items: center;
`

const DateText = styled.Text`
  align-items: center;
  text-align: center;
  width: 100%;
  color: white;
  font-size: 10;
  font-family: Roboto-Black;
`
