import React from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components/native'
import { assets } from '../../assets/index'
import { useSelector } from '../../redux/useSelector'
import * as selectors from '../../redux/selectors'
const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('screen').height

export function CalendarAssetDemo() {
  const locale = useSelector(selectors.currentLocaleSelector)
  const source = assets.general.calendarStatic[locale]

  return (
    <DayCarouselItemContainer
      style={{
        width: 0.6 * deviceWidth,
        height: 0.4 * deviceHeight,
        alignSelf: 'center',
      }}
    >
      <ImageContainer source={source} />
    </DayCarouselItemContainer>
  )
}

const DayCarouselItemContainer = styled.View`
  background-color: #fff;
  border-radius: 10px;
  elevation: 6;
  margin-horizontal: 10px;
  padding-horizontal: 20;
  padding-vertical: 15;
`

const ImageContainer = styled.Image`
  height: 100%;
  width: 100%;
  resize-mode: contain;
`
