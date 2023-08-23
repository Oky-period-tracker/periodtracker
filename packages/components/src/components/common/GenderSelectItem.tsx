import React from 'react'
import styled from 'styled-components/native'
import { assets } from '../../assets/index'
import { Text } from './Text'

export const GenderSelectItem = ({ gender, onPress, isActive = false }) => {
  const opacity = 0.4 + Number(isActive) * 0.6
  return (
    <Touchable onPress={onPress}>
      <Block style={{ opacity }}>
        <GenderIcon
          source={isActive ? assets.static.icons[gender] : assets.static.icons[gender + 'Grey']}
          resizeMode="contain"
        />
        <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 10, textAlign: 'center' }}>
          {gender}
        </Text>
      </Block>
    </Touchable>
  )
}

const Block = styled.View`
  width: 80;
  align-items: center;
`

const Touchable = styled.TouchableOpacity``

const GenderIcon = styled.ImageBackground`
  height: 40px;
  width: 40px;
  justify-content: center;
  align-items: center;
`
