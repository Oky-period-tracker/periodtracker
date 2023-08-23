import React from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components/native'
import { assets } from '../../assets/index'

const deviceWidth = Dimensions.get('window').width

export const NavigationBar = ({ focused, name }) => {
  return (
    <Column
      style={{
        backgroundColor: focused ? '#F5F5F5' : '#F1F1F1',
        width: deviceWidth / 4,
      }}
    >
      <ImageWrapper accessibilityLabel={name} style={{ elevation: focused ? 5 : 0 }}>
        <Icon
          source={
            focused ? assets.static.icons.tabs[name] : assets.static.icons.tabs[name + 'Grey']
          }
        />
      </ImageWrapper>
    </Column>
  )
}

const Column = styled.View`
  justify-content: center;
  align-items: center;
  height: 56px;
  margin-bottom: 5;
  border-left-width: 0.5px;
  border-right-width: 0.5px;
  border-color: #e1e2e2;
`

const Icon = styled.Image`
  width: 44;
  height: 44px;
`

const ImageWrapper = styled.View`
  width: 44;
  height: 44px;
  border-radius: 22px;
  background-color: transparent;
`
