import * as React from 'react'
import { Svg, Ellipse } from 'react-native-svg'
import { SvgIconProps } from './types'
import { View } from 'react-native'
import { useColor } from '../../hooks/useColor'

export const Circle = ({ style, size = 80, status = 'neutral' }: SvgIconProps) => {
  const { palette } = useColor()
  const colors = palette[status]

  return (
    <View style={[{ width: size, height: size }, style]} testID={'circle'}>
      <Svg width="100%" height="100%" viewBox="0 0 200 200">
        <Ellipse
          cx={102.5}
          cy={100}
          rx={97.5}
          ry={97.5}
          fill={'#000'}
          fillOpacity={0.1}
          strokeWidth={0.259686}
        />
        <Ellipse
          cx={95.136}
          cy={104.433}
          rx={90.136}
          ry={90.567}
          fill={colors.shadow}
          fillOpacity={1}
          strokeWidth={0.240646}
        />
        <Ellipse
          cx={103.864}
          cy={95.567}
          rx={90.136}
          ry={90.567}
          fill={colors.highlight}
          fillOpacity={1}
          strokeWidth={0.240646}
        />
        <Ellipse
          cx={104.864}
          cy={102.56}
          rx={90.136}
          ry={90.567}
          fill={colors.base}
          fillOpacity={1}
          strokeWidth={0.240646}
        />
        <Ellipse
          cx={101.473}
          cy={106.946}
          rx={86.059}
          ry={86.47}
          fill={colors.dark}
          fillOpacity={1}
          strokeWidth={0.22976}
        />
        <Ellipse
          cx={104.944}
          cy={99.591}
          rx={86.059}
          ry={86.47}
          fill={colors.base}
          fillOpacity={1}
          strokeWidth={0.22976}
        />
      </Svg>
    </View>
  )
}
