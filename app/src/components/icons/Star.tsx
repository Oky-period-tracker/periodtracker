import * as React from 'react'
import { Svg, Rect, G } from 'react-native-svg'
import { SvgIconProps } from './types'
import { View } from 'react-native'
import { useColor } from '../../hooks/useColor'

export const Star = ({ style, size = 80, status = 'neutral' }: SvgIconProps) => {
  const { palette } = useColor()
  const colors = palette[status]

  return (
    <View style={[{ width: size, height: size }, style]} testID="star">
      <Svg width="100%" height="100%" viewBox="0 0 200 200">
        <G transform="translate(-93.612 -13.943)">
          <Rect
            width={130.036}
            height={130.036}
            x={134.808}
            y={50.266}
            rx={0}
            ry={0}
            opacity={1}
            fill={'#000'}
            fillOpacity={0.1}
            strokeWidth={0.164877}
          />
          <Rect
            width={130.036}
            height={130.036}
            x={-126.846}
            y={-288.385}
            rx={0}
            ry={0}
            fill={'#000'}
            fillOpacity={0.1}
            strokeWidth={0.164877}
            transform="rotate(135)"
          />
        </G>
        <Rect
          width={123.625}
          height={123.625}
          x={23.857}
          y={39.288}
          rx={0}
          ry={0}
          fill={colors.shadow}
          fillOpacity={1}
          strokeWidth={0.156743}
        />
        <Rect
          width={123.625}
          height={123.625}
          x={-52.848}
          y={-194.403}
          rx={0}
          ry={0}
          fill={colors.shadow}
          fillOpacity={1}
          strokeWidth={0.156743}
          transform="rotate(135)"
        />
        <G transform="translate(-50.198 -6.965)">
          <Rect
            width={123.625}
            height={123.625}
            x={87.492}
            y={46.417}
            rx={0}
            ry={0}
            opacity={1}
            fill={colors.highlight}
            fillOpacity={1}
            strokeWidth={0.156743}
          />
          <Rect
            width={123.625}
            height={123.625}
            x={-92.803}
            y={-244.441}
            rx={0}
            ry={0}
            fill={colors.highlight}
            fillOpacity={1}
            strokeWidth={0.156743}
            transform="rotate(135)"
          />
        </G>
        <Rect
          width={123.625}
          height={123.625}
          x={44.282}
          y={39.44}
          rx={0}
          ry={0}
          opacity={1}
          fill={colors.base}
          fillOpacity={1}
          strokeWidth={0.156743}
        />
        <Rect
          width={123.625}
          height={123.625}
          x={-67.183}
          y={-208.953}
          rx={0}
          ry={0}
          fill={colors.base}
          fillOpacity={1}
          strokeWidth={0.156743}
          transform="rotate(135)"
        />
      </Svg>
    </View>
  )
}
