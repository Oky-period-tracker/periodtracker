import * as React from 'react'
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native'
import { Text } from '../../../components/Text'
import { useScreenDimensions } from '../../../hooks/useScreenDimensions'
import { useTodayPrediction } from '../../../contexts/PredictionProvider'
import { useDayStatus } from '../../../hooks/useDayStatus'
import { globalStyles } from '../../../config/theme'
import { useResponsive } from '../../../contexts/ResponsiveContext'
import { useColor } from '../../../hooks/useColor'

export const CenterCard = ({
  style,
  testID,
}: {
  style?: StyleProp<ViewStyle>
  testID?: string
}) => {
  const { width: screenWidth } = useScreenDimensions()
  const todaysInfo = useTodayPrediction()
  const { status } = useDayStatus(todaysInfo)
  const { UIConfig } = useResponsive()
  const { width, numberFontSize, textFontSize } = UIConfig.centerCard
  const { backgroundColor } = useColor()

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        globalStyles.shadow,
        {
          width,
          left: screenWidth / 2 - width - MARGIN_RIGHT,
          backgroundColor,
        },
        style,
      ]}
    >
      <Text
        enableTranslate={false}
        style={[styles.number, { fontSize: numberFontSize }]}
        status={status}
      >
        {todaysInfo.onPeriod ? todaysInfo.daysLeftOnPeriod : todaysInfo.daysUntilNextPeriod}
      </Text>
      <Text style={[styles.text, { fontSize: textFontSize }]} status={status}>
        {todaysInfo.onPeriod ? 'left' : 'to_go'}
      </Text>
    </View>
  )
}

const MARGIN_RIGHT = 8

const styles = StyleSheet.create({
  container: {
    height: 80,
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
