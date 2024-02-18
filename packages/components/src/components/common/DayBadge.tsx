import React from 'react'
import { assets } from '../../assets/index'
import styled from 'styled-components/native'
import { TextWithoutTranslation, Text } from './Text'
import _ from 'lodash'
import moment from 'moment'
import * as selectors from '../../redux/selectors'
import {
  useTodayPrediction,
  useActualCurrentStartDateSelector,
} from '../../components/context/PredictionProvider'
import { useSelector } from '../../hooks/useSelector'

function checkForVerifiedDay(cardValues) {
  if (_.has(cardValues, 'periodDay')) {
    return cardValues.periodDay
  }
  return false
}
function useStatusForSource(
  data,
  cardValues,
  hasFuturePredictionActive,
  currentCycleInfo,
  actualCurrentStartDate,
) {
  const isVerified = checkForVerifiedDay(cardValues)

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
        return assets.static.dayBadge.default
      }
    }
  }

  if (data.onPeriod && isVerified) return assets.static.dayBadge.onPeriod
  if (data.onPeriod && !isVerified) return assets.static.dayBadge.notVerifiedDay
  if (data.onFertile) return assets.static.dayBadge.onFertile
  return assets.static.dayBadge.default
}

export const DayBadge = ({ dataEntry, style, fontSizes, cardValues }) => {
  const currentCycleInfo = useTodayPrediction()
  const hasFuturePredictionActive = useSelector(selectors.isFuturePredictionSelector)

  const actualCurrentStartDate = useActualCurrentStartDateSelector()

  const source = useStatusForSource(
    dataEntry,
    cardValues,
    hasFuturePredictionActive,
    currentCycleInfo,
    actualCurrentStartDate,
  )
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
    <Background
      accessibilityLabel={`day ${dataEntry.cycleDay === 0 ? '-' : dataEntry.cycleDay}`}
      resizeMode="contain"
      style={style}
      source={source}
    >
      <DayText
        style={{
          color: isFutureDate
            ? 'white'
            : dataEntry.onPeriod && !checkForVerifiedDay(cardValues)
            ? '#e3629b'
            : 'white',
          fontSize: fontSizes.small,
          textTransform: 'capitalize',
        }}
      >
        day
      </DayText>
      <NumberText
        style={{
          fontSize: fontSizes.big,
          color: isFutureDate
            ? 'white'
            : dataEntry.onPeriod && !checkForVerifiedDay(cardValues)
            ? '#e3629b'
            : 'white',
        }}
      >
        {dataEntry.cycleDay === 0 ? '-' : dataEntry.cycleDay}
      </NumberText>
    </Background>
  )
}

const Background = styled.ImageBackground`
  width: 90px;
  height: 40px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 18px;
`

const NumberText = styled(TextWithoutTranslation)`
  color: white;
  font-size: 28;
  font-family: Roboto-Black;
`

const DayText = styled(Text)`
  color: white;
  font-size: 28;
  font-family: Roboto-Black;
`
