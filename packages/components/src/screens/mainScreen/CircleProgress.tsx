import React from 'react'
import { Text } from '../../components/common/Text'
import PieChart from 'react-native-pie-chart'
import { Icon } from '../../components/common/Icon'
import { useTodayPrediction } from '../../components/context/PredictionProvider'
import styled from 'styled-components/native'
import { assets } from '../../assets/index'

export const CircleProgress = ({
  onPress = null,
  fillColor,
  emptyFill,
  size = 50,
  style = null,
  isCalendarTextVisible = false,
  disabled = false,
}) => {
  const { cycleDay, cycleLength } = useTodayPrediction()
  const series = [cycleDay, cycleLength - cycleDay]
  const sliceColor = [fillColor, emptyFill]
  return (
    <TouchableContainer disabled={disabled} onPress={onPress} size={size} style={style}>
      <PieChart widthAndHeight={size} series={series} sliceColor={sliceColor} />
      <Icon
        source={assets.static.icons.roundedMask}
        style={{ width: size, height: size, position: 'absolute', top: 0 }}
      />
      <TextContainer size={size}>
        <NumberText>{cycleLength === 100 ? '-' : cycleLength}</NumberText>
        <DayText>days</DayText>
      </TextContainer>
      {isCalendarTextVisible && (
        <DayText style={{ fontSize: 10, position: 'absolute', bottom: -15 }}>calendar</DayText>
      )}
    </TouchableContainer>
  )
}

const TouchableContainer = styled.TouchableOpacity<{ size: number }>`
  height: ${(props) => props.size};
  width: ${(props) => props.size};
  border-radius: ${(props) => props.size / 2};
  align-items: center;
`

const NumberText = styled.Text`
  height: 17px;
  font-size: 14;
  text-align: center;
  font-family: Roboto-Black;
`

const DayText = styled(Text)`
  height: 14px;
  font-size: 11;
  text-align: center;
  color: #000;
`
const TextContainer = styled.View<{ size: number }>`
  height: ${(props) => props.size};
  position: absolute;
  justify-content: center;
  align-items: center;
`
