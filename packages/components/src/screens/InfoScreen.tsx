import React from 'react'
import styled from 'styled-components/native'
import { BackgroundTheme } from '../components/layout/BackgroundTheme'
import { PageContainer } from '../components/layout/PageContainer'
import { Header } from '../components/common/Header'
import { Avatar } from '../components/common/Avatar/Avatar'
import { ListItem } from '../components/common/ListItem'
import { navigate } from '../services/navigationService'
import { assets } from '../assets/index'
import { Text } from '../components/common/Text'
import { SHOW_ENCYCLOPEDIA_LOGGED_OUT } from '../config'

export function InfoScreen() {
  return (
    <BackgroundTheme>
      <PageContainer>
        <Header screenTitle="info" />
        <AvatarSection>
          <Avatar isProgressVisible={false} style={{ position: 'absolute' }} />
        </AvatarSection>
        <Container>
          <NavigationContainer style={{ flex: 1 }}>
            <NavigationLink onPress={() => navigate('AboutScreen', null)}>
              <ListItem title="about" description="about_info" />
            </NavigationLink>
            <NavigationLink onPress={() => navigate('TermsScreen', null)}>
              <ListItem title="t_and_c" description="t_and_c_info" />
            </NavigationLink>
            <NavigationLink
              onPress={() => {
                navigate('PrivacyScreen', null)
              }}
            >
              <ListItem
                style={{ borderBottomWidth: 0 }}
                title="privacy_policy"
                description="privacy_info"
              />
            </NavigationLink>
          </NavigationContainer>
          {SHOW_ENCYCLOPEDIA_LOGGED_OUT ? (
            <NavigationContainer style={{ marginTop: 12 }}>
              <Row
                onPress={() => {
                  navigate('Encyclopedia', null)
                }}
              >
                <Title style={{ textTransform: 'capitalize' }}>encyclopedia</Title>
                <NewsIcon source={assets.static.icons.news} />
              </Row>
            </NavigationContainer>
          ) : null}
        </Container>
      </PageContainer>
    </BackgroundTheme>
  )
}

const NavigationLink = styled.TouchableOpacity`
  flex: 1;
`

const Row = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
`

const NavigationContainer = styled.View`
  border-radius: 10px;
  elevation: 3;
  background: #fff;
  margin-horizontal: 2px;
`
const Container = styled.View`
  flex: 1;
  margin-bottom: 18px;
`
const AvatarSection = styled.View`
  flex: 1;
  justify-content: center;
`
const NewsIcon = styled.Image`
  width: 28px;
  height: 28px;
  margin-right: 13px;
  margin-top: 10px;
  margin-bottom: 10px;
`
const Title = styled(Text)`
  font-size: 16;
  text-align: center;
  font-family: Roboto-Black;
  padding-left: 30px;
  padding-top: 15px;
  padding-bottom: 15px;
`
