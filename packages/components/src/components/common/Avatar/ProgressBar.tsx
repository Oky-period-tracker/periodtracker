import React from 'react'
import { View } from 'react-native'

export const ProgressBar = ({
  value = 50,
  borderRadius = 20,
  height = 8,
  width = 55,
  color = '#F49200',
  emptyFill = '#FFF',
}) => {
  const fill = value !== 100
  const borderLeftRadius = fill ? borderRadius : 0
  const borderRightRadius = fill ? 0 : borderRadius
  const progress = Math.floor(value / 5) * 5

  return (
    <View
      style={{
        width,
        flexDirection: 'row',
        height,
        borderRadius,
        backgroundColor: fill ? emptyFill : color,
        justifyContent: fill ? 'flex-start' : 'flex-end',
        borderWidth: 1,
        borderColor: color,
      }}
    >
      <View
        style={{
          width: fill ? progress + '%' : 100 - progress + '%',
          height: height - 2,
          backgroundColor: fill ? color : emptyFill,
          borderTopRightRadius: borderRightRadius,
          borderBottomRightRadius: borderRightRadius,
          borderBottomLeftRadius: borderLeftRadius,
          borderTopLeftRadius: borderLeftRadius,
        }}
      />
    </View>
  )
}
