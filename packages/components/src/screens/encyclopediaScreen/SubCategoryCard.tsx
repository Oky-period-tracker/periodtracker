import React from 'react'
import styled from 'styled-components/native'
import { TextWithoutTranslation, Text } from '../../components/common/Text'
import { useScreenDimensions } from '../../hooks/useScreenDimensions'
import { useHapticAndSound } from '../../hooks/useHapticAndSound'

export const SubCategoryCard = ({
  title,
  onPress,
  isSelected,
}: {
  title: string
  onPress: () => void
  isSelected?: boolean
}) => {
  const { screenWidth } = useScreenDimensions()
  const hapticAndSoundFeedback = useHapticAndSound()

  const color = isSelected ? '#e3629b' : '#ff9e00'

  return (
    <SubCategoryContainer
      activeOpacity={0.8}
      onPress={() => {
        hapticAndSoundFeedback('general')
        onPress()
      }}
      style={{ left: 0.05 * screenWidth, width: 0.87 * screenWidth }}
    >
      <Title style={{ color }}>{title}</Title>
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
