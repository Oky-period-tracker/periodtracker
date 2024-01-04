import React from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components/native'
import { assets } from '../../assets/index'
import { useSelector } from '../../hooks/useSelector'
import * as selectors from '../../redux/selectors'
import { useScreenDimensions } from '../../hooks/useScreenDimensions'

export function CalendarAssetDemo() {
  const { screenWidth, screenHeight } = useScreenDimensions()
  const locale = useSelector(selectors.currentLocaleSelector)
  const source = assets.general.calendarStatic[locale]

  return (
    <DayCarouselItemContainer
      style={{
        width: 0.6 * screenWidth,
        height: 0.4 * screenHeight,
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
