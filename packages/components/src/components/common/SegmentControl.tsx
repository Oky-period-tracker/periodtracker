import React from 'react'
import styled from 'styled-components/native'
import { assets } from '../../assets/index'
import { Text } from './Text'
import { AppAssets } from '@oky/core'

export const SegmentControl = ({
  option,
  onPress,
  isActive = false,
}: {
  option: keyof AppAssets['static']['icons']
  onPress: () => void
  isActive?: boolean
}) => {
  const opacity = 0.4 + Number(isActive) * 0.6
  return (
    <Touchable onPress={onPress}>
      <Block style={{ opacity }}>
        <Icon
          source={isActive ? assets.static.icons[option] : assets.static.icons[option + 'Grey']}
          resizeMode="contain"
        />
        <Text style={{ fontFamily: 'Roboto-Regular', fontSize: 10, textAlign: 'center' }}>
          {option}
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

const Icon = styled.ImageBackground`
  height: 40px;
  width: 40px;
  justify-content: center;
  align-items: center;
`
