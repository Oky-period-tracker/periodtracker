import React from 'react'
import { ImageProps } from 'react-native'
import styled from 'styled-components/native'

export const Icon = ({
  source,
  style = null,
}: {
  source: ImageProps['source']
  style?: ImageProps['style']
}) => {
  return <ImageContainer resizeMode="contain" source={source} style={style} />
}

const ImageContainer = styled.Image`
  height: 20px;
  width: 20px;
`
