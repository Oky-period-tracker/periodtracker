import React from 'react'
import styled from 'styled-components/native'

export const Icon = ({ source, style = null }) => {
  return <ImageContainer resizeMode="contain" source={source} style={style} />
}

const ImageContainer = styled.Image`
  height: 20px;
  width: 20px;
`
