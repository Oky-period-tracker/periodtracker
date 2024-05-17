import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'
import { HelpCenter } from './components/HelpCenter'
import { HelpCenters } from '@oky/core'
import { useScreenDimensions } from '../../hooks/useScreenDimensions'
import { SwiperContainer } from '../../components/common/SwiperContainer'
import { HelpCenterUI } from '../../types'
import { Text } from '../../components/common/Text'

interface IHelpCenterContainer {
  isFilterActive: boolean
  filteredHelpCenters: HelpCenters
  setActiveSwipeIndex: (n: number) => void
  activeTab: number
}

export const HelpCenterContainer: FunctionComponent<IHelpCenterContainer> = ({
  isFilterActive,
  filteredHelpCenters,
  setActiveSwipeIndex,
  activeTab,
}) => {
  const { screenWidth, screenHeight } = useScreenDimensions()
  const height = isFilterActive ? screenHeight * 0.53 : screenHeight * 0.65

  return (
    <CarouselSection style={{ width: screenWidth, height }}>
      <SwiperContainer
        ref={null}
        setIndex={setActiveSwipeIndex}
        pagingEnabled={true}
        scrollEnabled={true}
        customDotMarginBottom={isFilterActive ? -100 : -100}
      >
        <CarouselItem isFilterActive={isFilterActive} type={HelpCenterUI.HC}>
          <CardTitle>find_help_center</CardTitle>
          <HelpCenter
            helpCenters={filteredHelpCenters}
            type={HelpCenterUI.HC}
            activeTab={activeTab}
          />
        </CarouselItem>
        <CarouselItem isFilterActive={isFilterActive} type={HelpCenterUI.SAVED_HC}>
          <CardTitle>saved_help_center</CardTitle>
          <HelpCenter type={HelpCenterUI.SAVED_HC} activeTab={activeTab} />
        </CarouselItem>
      </SwiperContainer>
    </CarouselSection>
  )
}

const CarouselSection = styled.View`
  left: -10;
  align-items: center;
  justify-content: center;
`

const CardTitle = styled(Text)`
  font-size: 16;
  font-family: Roboto-Black;
  color: #fff;
  margin-bottom: 10px;
`

const CarouselItem = styled.View<{ isFilterActive: boolean; type: string }>`
  width: 95%;
  padding-horizontal: 15px;
  padding-top: 10px;
  padding-bottom: 40;
  background-color: ${(prop) => (prop.type === HelpCenterUI.HC ? '#f09408' : '#DB307A')}
  border-radius: 10px;
  margin-horizontal: 10px;
  elevation: 4;
  margin-top: ${(prop) => (prop.isFilterActive ? 10 : 20)};
`
