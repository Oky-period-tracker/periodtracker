import React from 'react'
import { Text } from './Text'

export const TitleText = ({ children, size = 26, style = null }) => (
  <Text
    style={{
      color: '#F49200',
      textTransform: 'uppercase',
      fontFamily: 'Roboto-Black',
      fontSize: size,
      ...style,
    }}
  >
    {children}
  </Text>
)
