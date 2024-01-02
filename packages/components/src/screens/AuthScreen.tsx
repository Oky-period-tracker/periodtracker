import React from 'react'
import styled from 'styled-components/native'
import { PageContainer } from '../components/layout/PageContainer'
import { Text } from '../components/common/Text'
import { BackgroundTheme } from '../components/layout/BackgroundTheme'
import { assets } from '../assets/index'
import { AnimatedContainer } from './authScreen/AnimatedContainer'
// @TODO: LANGUAGES This is commented in case the client wants multiple languages
import { LanguageSelect } from '../components/common/LanguageSelect'
import { PrimaryButton } from '../components/common/buttons/PrimaryButton'
import { navigate } from '../services/navigationService'

export function AuthScreen() {
  const [toggled, setToggled] = React.useState(true)
  // @TODO: LANGUAGES This is commented in case the client wants multiple languages
  // const locale = useSelector(selectors.currentLocaleSelector)

  return (
    <BackgroundTheme>
      <PageContainer style={{ justifyContent: 'center' }}>
        {toggled && (
          <Row style={{ position: 'absolute', top: 50 }}>
            <LaunchLogo resizeMode="contain" source={assets.static.launch_icon} />
            <FlexContainer>
              <HeaderText>auth_welcome</HeaderText>
              <HeaderText style={{ fontSize: 14 }}>auth_catchphrase</HeaderText>
            </FlexContainer>
          </Row>
        )}
        <Container />
        <Container>
          <AnimatedContainer toggled={(val) => setToggled(val)} />
        </Container>
        {toggled && (
          <BottomRow style={{}}>
            <ButtonContainer style={{ paddingRight: 30 }}>
              <PrimaryButton onPress={() => navigate('InfoScreen', null)}>info</PrimaryButton>
            </ButtonContainer>
            <ButtonContainer style={{ paddingLeft: 30 }}>
              {/* // @TODO: LANGUAGES This is commented in case the client wants multiple languages */}
              <LanguageSelect />
            </ButtonContainer>
          </BottomRow>
        )}
      </PageContainer>
    </BackgroundTheme>
  )
}

const HeaderText = styled(Text)`
  color: #f49200;
  font-family: Roboto-Black;
  font-size: 32;
`
const Row = styled.View`
  flex-direction: row;
  margin-horizontal: auto;
  align-items: center;
  justify-content: center;
`

const BottomRow = styled.View`
  flex-direction: row;
  width: 100%;
  position: absolute;
  align-self: center;
  bottom: 10;
`

const Container = styled.View`
  flex-direction: column;
  width: 100%;
`
const LaunchLogo = styled.Image`
  height: 110;
  width: 110;
  margin-left: 10;
  margin-right: 10;
`

const FlexContainer = styled.View`
  flex: 1;
`

const ButtonContainer = styled.View`
  width: 50%;
`
