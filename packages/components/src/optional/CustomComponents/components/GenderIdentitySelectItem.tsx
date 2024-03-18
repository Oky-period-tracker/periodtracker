import React from 'react'
import styled from 'styled-components/native'
import { assets } from '../../../assets/index'
import { translate } from '../../../i18n'

export const GenderIdentitySelectItem = ({ genderIdentity, onPress, isActive = false }) => {
  const opacity = 0.4 + Number(isActive) * 0.6
  return (
    <Touchable onPress={onPress}>
      <Block style={{ opacity }}>
        <GenderIdentityIcon
          source={
            isActive
              ? assets.static.icons[genderIdentity]
              : assets.static.icons[genderIdentity + 'Grey']
          }
          resizeMode="contain"
        />
        <GenderIdentityText>{translate(genderIdentity)}</GenderIdentityText>
      </Block>
    </Touchable>
  )
}

const Block = styled.View`
  width: 80;
  align-items: center;
`

const Touchable = styled.TouchableOpacity``

const GenderIdentityIcon = styled.ImageBackground`
  height: 40px;
  width: 40px;
  justify-content: center;
  align-items: center;
`

const GenderIdentityText = styled.Text`
  font-family: Roboto-Regular;
  font-size: 10px;
  text-align: center;
  color: black;
`
