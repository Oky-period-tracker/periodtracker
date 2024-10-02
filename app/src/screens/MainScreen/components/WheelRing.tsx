import React from 'react'
import { ReduxState } from '../../../redux/reducers'
import { useSelector } from '../../../redux/useSelector'
import { useDayScroll } from '../DayScrollContext'
import { getDayStatus } from '../../../hooks/useDayStatus'
import PieChart from 'react-native-pie-chart'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from '../../../components/Text'
import { Appearance, IconButtonProps } from '../../../components/IconButton'
import { Palette, PaletteStatus, useColor } from '../../../hooks/useColor'

export const WheelRing = () => {
  const { data, diameter, constants } = useDayScroll()
  const { palette } = useColor()

  const reduxState = useSelector((s) => s) as ReduxState

  const innerCircleSize = Math.abs(diameter - constants.BUTTON_SIZE * 2)
  const coverRadius = diameter > 0 ? Math.round((innerCircleSize / diameter) * 100) / 100 : 0.1

  const outerInnerCircleSize = innerCircleSize - OUTER_BORDER_WIDTH * 2

  const outerCoverRadius =
    diameter > 0 ? Math.round((outerInnerCircleSize / diameter) * 100) / 100 : 0.1

  const segmentPercentage = Math.round((100 / constants.NUMBER_OF_BUTTONS) * 100) / 100
  const segmentBodyPercentage = segmentPercentage - BORDER_PERCENTAGE * 2

  const { series, sliceColor, sliceColorOuter } = React.useMemo(
    () =>
      data.reduce<{
        series: number[]
        sliceColor: string[]
        sliceColorOuter: string[]
      }>(
        (acc, curr) => {
          const { status, appearance } = getDayStatus(reduxState, curr)

          const { border, fill } = getSegmentColors(palette, status, appearance)

          const newSeries = [BORDER_PERCENTAGE, segmentBodyPercentage, BORDER_PERCENTAGE]
          const newSliceColor = [border, fill, border]
          const newSliceColorOuter = [border, border, border]

          return {
            series: [...acc.series, ...newSeries],
            sliceColor: [...acc.sliceColor, ...newSliceColor],
            sliceColorOuter: [...acc.sliceColorOuter, ...newSliceColorOuter],
          }
        },
        {
          series: [],
          sliceColor: [],
          sliceColorOuter: [],
        },
      ),
    [data, reduxState],
  )

  return (
    <>
      <PieChart
        widthAndHeight={diameter + OUTER_BORDER_WIDTH}
        series={series}
        sliceColor={sliceColorOuter}
        coverRadius={outerCoverRadius}
        style={[styles.pie, styles.borderPie]}
      />
      <PieChart
        widthAndHeight={diameter}
        series={series}
        sliceColor={sliceColor}
        coverRadius={coverRadius}
        style={styles.pie}
      />
    </>
  )
}

export const WheelRingButton = ({
  onPress,
  status = 'neutral',
  appearance,
  text,
  size,
  ...props
}: IconButtonProps) => {
  const { palette } = useColor()

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          width: size,
          height: size,
        },
      ]}
      {...props}
    >
      <Text
        style={[styles.text, appearance === 'outline' && { color: palette[status].base }]}
        enableTranslate={false}
      >
        {text}
      </Text>
    </TouchableOpacity>
  )
}

const getSegmentColors = (palette: Palette, status: PaletteStatus, appearance: Appearance) => {
  if (status === 'danger' && appearance === 'outline') {
    return {
      border: palette.danger.base,
      fill: '#fff',
    }
  }
  if (status === 'danger') {
    return {
      border: palette.danger.dark,
      fill: palette.danger.base,
    }
  }
  if (status === 'tertiary') {
    return {
      border: palette.tertiary.dark,
      fill: palette.tertiary.base,
    }
  }
  return {
    border: palette.neutral.dark,
    fill: palette.neutral.base,
  }
}

const OUTER_BORDER_WIDTH = 12
const BORDER_PERCENTAGE = 0.5

const styles = StyleSheet.create({
  pie: {
    // 45 Shift to align pie with segments
    // 30 to rotate by 1 segment
    // 360 / 12 = 30
    transform: [{ rotate: `${45 + 30}deg` }],
  },
  borderPie: {
    position: 'absolute',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    width: '60%',
    textAlign: 'center',
    fontWeight: 'bold',
    marginRight: 8,
    color: '#fff',
  },
})
