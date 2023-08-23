import React from 'react'
import { Dimensions } from 'react-native'
import { useTodayPrediction } from '../../components/context/PredictionProvider'
import { useColor } from '../../hooks/useColor'
import styled from 'styled-components/native'
import { TextWithoutTranslation, Text } from '../../components/common/Text'

const position = 0.5 * Dimensions.get('window').height * 0.45
const width = 0.3 * Dimensions.get('window').width

export const CenterCard = ({ style = null }) => {
  const todaysInfo = useTodayPrediction()
  const color = useColor(todaysInfo.onPeriod, todaysInfo.onFertile)
  return (
    <CenterCardContainer style={{ top: position, ...style }}>
      <Container color={color}>
        <TextNoTranslate style={{ color, fontFamily: 'Roboto-Black' }}>
          {todaysInfo.onPeriod ? todaysInfo.daysLeftOnPeriod : todaysInfo.daysUntilNextPeriod}
        </TextNoTranslate>
        <TextTranslate style={{ color }}>{todaysInfo.onPeriod ? 'left' : 'to_go'}</TextTranslate>
      </Container>
    </CenterCardContainer>
  )
}

const CenterCardContainer = styled.View`
  position: absolute;
  right: 15px;
  width: ${width};
  height: 70px;
  border-radius: 10px;
  flex-direction: row;
  background-color: white;
  elevation: 6;
`

const Container = styled.View<{ color: string }>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 4px;
`

const TextNoTranslate = styled(TextWithoutTranslation)`
  flex: 1;
  text-align: center;
  align-items: center;
  justify-content: center;
  font-size: 40;
`

const TextTranslate = styled(Text)`
  flex: 1;
  text-align: left;
  align-items: flex-start;
  justify-content: center;
  font-size: ${(props) => props.theme.fontSize};
`
