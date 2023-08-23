import React from 'react'
import styled from 'styled-components/native'
import { useTheme } from '../../components/context/ThemeContext'
import { Text } from '../../components/common/Text'
import { assets } from '../../assets/index'

export function ColourButtonsDemo({ showBlue = false }) {
  const { id: themeName } = useTheme()

  return (
    <Container>
      <Row style={{ marginBottom: 20 }}>
        <Column>
          <Button disabled={true}>
            <Mask
              resizeMode="contain"
              source={
                showBlue
                  ? assets.static.icons.clouds.period
                  : assets.static.icons.clouds.notVerifiedDay
              }
            />
          </Button>
          <InnerText style={{ top: -40 }}>{showBlue ? 'period' : 'unverified_button'}</InnerText>
        </Column>
        <Column>
          <Button style={[{ marginHorizontal: 10 }]} disabled={true}>
            <Mask
              resizeMode="contain"
              source={
                showBlue ? assets.static.icons.clouds.fertile : assets.static.icons.clouds.period
              }
            />
          </Button>
          <InnerText style={{ top: -40 }}>{showBlue ? 'ovulation' : 'period'}</InnerText>
        </Column>
        <Column>
          <Button disabled={true}>
            <Mask resizeMode="contain" source={assets.static.icons.clouds.nonPeriod} />
          </Button>
          <InnerText style={{ top: -40 }}>non_period</InnerText>
        </Column>
      </Row>
    </Container>
  )
}

const Container = styled.View`
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

const Column = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Button = styled.TouchableOpacity`
  height: 85;
  width: 85;
  align-items: center;
  justify-content: center;
`

const InnerText = styled(Text)`
  color: white;
  font-size: 16;
  position: absolute;
  text-align: center;
  font-family: Roboto-Black;
`

const Mask = styled.ImageBackground`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`
