import React from 'react'
import styled from 'styled-components/native'
import { PageContainer } from '../components/layout/PageContainer'
import { Text } from '../components/common/Text'
import { BackgroundTheme } from '../components/layout/BackgroundTheme'
import { assets } from '../assets/index'
import { AnimatedContainer } from './authScreen/AnimatedContainer'
import { LanguageSelect } from '../components/common/LanguageSelect'
import { PrimaryButton } from '../components/common/buttons/PrimaryButton'
import { navigate } from '../services/navigationService'
import { StyleSheet } from 'react-native'

export function AuthScreen() {
  const [toggled, setToggled] = React.useState(true)

  return (
    <BackgroundTheme>
      <PageContainer style={styles.page}>
        {toggled && (
          <Row>
            <LaunchLogo resizeMode="contain" source={assets.static.launch_icon} />
            <FlexContainer>
              <HeaderText>auth_welcome</HeaderText>
              <HeaderText style={styles.headerText}>auth_catchphrase</HeaderText>
            </FlexContainer>
          </Row>
        )}
        <Container />
        <Container>
          <AnimatedContainer toggled={(val) => setToggled(val)} />
        </Container>
        {toggled && (
          <BottomRow>
            <PrimaryButton style={styles.info} onPress={() => navigate('InfoScreen', null)}>
              info
            </PrimaryButton>
            <LanguageSelect style={styles.language} />
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
  position: absolute;
  top: 50;
`

const BottomRow = styled.View`
  flex: 1;
  flex-direction: row;
  width: 100%;
  position: absolute;
  align-self: center;
  bottom: 10;
  justify-content: space-between;
`

const Container = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

const styles = StyleSheet.create({
  page: { justifyContent: 'center' },
  headerText: { fontSize: 14 },
  info: { flex: 1, marginRight: 30 },
  language: { flex: 1, marginLeft: 30 },
})
