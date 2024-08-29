import * as React from 'react'
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native'
import { Text } from '../../../components/Text'
import { useScreenDimensions } from '../../../hooks/useScreenDimensions'
import { useTodayPrediction } from '../../../contexts/PredictionProvider'
import { useDayStatus } from '../../../hooks/useDayStatus'
import { globalStyles } from '../../../config/theme'

export const CenterCard = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const { width } = useScreenDimensions()
  const todaysInfo = useTodayPrediction()
  const { status } = useDayStatus(todaysInfo)

  return (
    <View
      style={[
        styles.container,
        globalStyles.shadow,
        { left: width / 2 - WIDTH - MARGIN_RIGHT },
        style,
      ]}
    >
      <Text enableTranslate={false} style={styles.number} status={status}>
        {todaysInfo.onPeriod ? todaysInfo.daysLeftOnPeriod : todaysInfo.daysUntilNextPeriod}
      </Text>
      <Text style={styles.text} status={status}>
        {todaysInfo.onPeriod ? 'left' : 'to_go'}
      </Text>
    </View>
  )
}

const WIDTH = 120
const MARGIN_RIGHT = 8

const styles = StyleSheet.create({
  container: {
    width: WIDTH,
    height: 80,
    backgroundColor: '#FFF',
    position: 'absolute',
    borderRadius: 12,
    flexDirection: 'row',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  text: {
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
})
