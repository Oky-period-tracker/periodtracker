import React from 'react'
import styled from 'styled-components/native'
import { assets } from '../../assets/index'
import { AppAssets } from '@oky/core'
import { useScreenDimensions } from '../../hooks/useScreenDimensions'
import { Platform } from 'react-native'
import { IS_TABLET } from '../../config/tablet'

export const NavigationBar = ({
  focused,
  name,
}: {
  focused: boolean
  name: keyof AppAssets['static']['icons']['tabs']
}) => {
  const { screenWidth } = useScreenDimensions()

  return (
    <Column
      style={{
        backgroundColor: focused ? '#F5F5F5' : '#F1F1F1',
        width: screenWidth / 4,
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
  height: ${IS_TABLET ? '80' : '56'}px;
  margin-bottom: ${IS_TABLET && Platform.OS === 'ios' ? '0' : '5'}px;
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
