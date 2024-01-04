import React from 'react'
import styled from 'styled-components/native'
import { TextWithoutTranslation, Text } from '../../components/common/Text'
import { useScreenDimensions } from '../../hooks/useScreenDimensions'

export const SubCategoryCard = ({ title, onPress }) => {
  const { screenWidth } = useScreenDimensions()

  return (
    <SubCategoryContainer
      activeOpacity={0.8}
      onPress={onPress}
      style={{ left: 0.05 * screenWidth, width: 0.87 * screenWidth }}
    >
      <Title>{title}</Title>
    </SubCategoryContainer>
  )
}

export const VideoSubCategoryCard = ({ title, onPress }) => {
  const { screenWidth } = useScreenDimensions()

  return (
    <SubCategoryContainer
      activeOpacity={0.8}
      onPress={onPress}
      style={{ left: 0.05 * screenWidth, width: 0.87 * screenWidth }}
    >
      <VideoTitle>{title}</VideoTitle>
    </SubCategoryContainer>
  )
}

const SubCategoryContainer = styled.TouchableOpacity`
  min-height: 65px;
  justify-content: center;
  align-items: flex-start;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
  background-color: #fff;
  elevation: 3;
  border-radius: 10px;
  margin-vertical: 5px;
  margin-horizontal: 2px;
`

const Title = styled(TextWithoutTranslation)`
  font-family: Roboto-Black;
  color: #ff9e00;
  font-size: 18;
`

const VideoTitle = styled(Text)`
  font-family: Roboto-Black;
  color: #ff9e00;
  font-size: 18;
`
