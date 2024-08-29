import React from 'react'
import { StyleSheet } from 'react-native'
import { Button, ButtonProps } from '../../../components/Button'
import { Text } from '../../../components/Text'
import { useTodayPrediction } from '../../../contexts/PredictionProvider'
import PieChart from 'react-native-pie-chart'

export const CircleProgress = ({ size = 52, style, onPress }: ButtonProps & { size?: number }) => {
  const { cycleDay, cycleLength } = useTodayPrediction()
  const series = [cycleDay, cycleLength - cycleDay]

  return (
    <Button
      onPress={onPress}
      status={'secondary'}
      style={[
        styles.button,
        {
          width: size,
          height: size,
        },
        style,
      ]}
    >
      <PieChart widthAndHeight={size} series={series} sliceColor={sliceColor} style={styles.pie} />
      <Text style={styles.numberText} enableTranslate={false}>
        {cycleLength === 100 ? '-' : cycleLength}
      </Text>
      <Text>days</Text>
    </Button>
  )
}

const sliceColor = ['#fff', 'transparent']

const styles = StyleSheet.create({
  button: {
    zIndex: 999, // Keep above Avatar
  },
  numberText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pie: {
    position: 'absolute',
    opacity: 0.5,
  },
})
