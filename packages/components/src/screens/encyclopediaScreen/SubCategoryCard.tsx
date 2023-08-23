import React from 'react'
import styled from 'styled-components/native'
import { TextWithoutTranslation } from '../../components/common/Text'
import { Dimensions } from 'react-native'

const screenWidth = Dimensions.get('screen').width
export const SubCategoryCard = ({ title, onPress }) => {
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

const SubCategoryContainer = styled.TouchableOpacity`
  height: 65px;
  justify-content: center;
  align-items: flex-start;
  padding-left: 21;
  padding-right: 36;
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
