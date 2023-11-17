import React from 'react'
import { Platform, StyleSheet } from 'react-native'
import styled from 'styled-components/native'
import { BackgroundTheme } from '../components/layout/BackgroundTheme'
import { Header } from '../components/common/Header'
import { Avatar } from '../components/common/Avatar/Avatar'
import { TextWithoutTranslation, Text } from '../components/common/Text'
import { SwiperContainer } from '../components/common/SwiperContainer'
import { PageContainer } from '../components/layout/PageContainer'
import { useSelector } from '../hooks/useSelector'
import * as selectors from '../redux/selectors'
import { useTextToSpeechHook } from '../hooks/useTextToSpeechHook'
import analytics from '@react-native-firebase/analytics'
import { fetchNetworkConnectionStatus } from '../services/network'
import { useScreenDimensions } from '../hooks/useScreenDimensions'

export function FindHelpScreen({ navigation }) {
  const { screenHeight, screenWidth } = useScreenDimensions()
  const heightOfCarousel = screenHeight * 0.5

  const helpCenters: any = useSelector(selectors.allHelpCentersForCurrentLocale)

  const [textToSpeak, setTextToSpeak] = React.useState([])

  React.useEffect(() => {
    if (fetchNetworkConnectionStatus()) {
      analytics().logScreenView({
        screen_class: 'HelpCenter',
        screen_name: 'FindHelpScreen',
      })
    }
    const text = helpCenters.reduce((acc, item, index) => {
      let heading = ''
      let caption = ''
      let phoneOne = ''
      let phoneTwo = ''
      let address = ''
      let website = ''
      const pageNumber = `page number ${index + 1}`

      heading = item.title && item.title
      caption = item.caption && item.caption
      phoneOne = item.contactOne && item.contactOne
      phoneTwo = item.contactTwo && item.contactTwo
      address = item.address && item.address
      website = item.website && item.website
      return acc.concat([
        heading,
        ...(caption !== '' ? [caption] : []),
        ...(phoneOne !== '' ? [phoneOne] : []),
        ...(phoneTwo !== '' ? [phoneTwo] : []),
        ...(address !== '' ? [address] : []),
        ...(website !== '' ? [website] : []),
        pageNumber,
      ])
    }, [])
    setTextToSpeak(text)
  }, [])

  useTextToSpeechHook({ navigation, text: textToSpeak })

  return (
    <BackgroundTheme>
      <PageContainer>
        <Header screenTitle="find help" />
        <MiddleSection>
          <AvatarSection>
            <Avatar
              avatarStyle={styles.avatarStyle}
              style={styles.avatar}
              disable={true}
              isProgressVisible={false}
            />
          </AvatarSection>
        </MiddleSection>
        <CarouselSection style={{ width: screenWidth, height: heightOfCarousel }}>
          <SwiperContainer pagingEnabled={true} scrollEnabled={true} ref={null}>
            {helpCenters.map((item, index) => {
              return (
                <CarouselItem key={index}>
                  <CardTitle>{item.title}</CardTitle>
                  {item.caption !== '' && (
                    <CardTitle style={{ fontSize: 16 }}>{item.caption}</CardTitle>
                  )}
                  <CardRow>
                    <Col>
                      <InfoItemTitle>card_phone_number</InfoItemTitle>
                      <InfoItemDescription>{item.contactOne}</InfoItemDescription>
                    </Col>
                    {item.contactTwo !== '' && (
                      <Col>
                        <InfoItemTitle>card_phone_number</InfoItemTitle>
                        <InfoItemDescription>{item.contactTwo}</InfoItemDescription>
                      </Col>
                    )}
                  </CardRow>
                  {item.address !== '' && (
                    <CardRow>
                      <Col>
                        <InfoItemTitle>card_address</InfoItemTitle>
                        <InfoItemDescription>{item.address}</InfoItemDescription>
                      </Col>
                    </CardRow>
                  )}
                  {item.website !== '' && (
                    <CardRow>
                      <Col>
                        <InfoItemTitle>card_website</InfoItemTitle>
                        <InfoItemDescription>{item.website}</InfoItemDescription>
                      </Col>
                    </CardRow>
                  )}
                </CarouselItem>
              )
            })}
          </SwiperContainer>
        </CarouselSection>
      </PageContainer>
    </BackgroundTheme>
  )
}

const MiddleSection = styled.View`
  width: 100%;
  overflow: hidden;
  height: 30%;
`

const AvatarSection = styled.View`
  justify-content: flex-start;
  align-items: flex-start;
  width: 50%;
`

const CarouselSection = styled.View`
  left: -10;
  align-items: center;
  justify-content: center;
`

const CardTitle = styled(TextWithoutTranslation)`
  font-size: 20;
  font-family: Roboto-Black;
  color: #e3629b;
  margin-bottom: 10px;
`

const CardRow = styled.View`
  flex-direction: row;
  width: 95%;
  margin-bottom: 5px;
  overflow-hidden;
`

const Col = styled.View`
  flex: 1;
  flex-direction: column;
`

const InfoItemTitle = styled(Text)`
  font-size: 16;
  margin-bottom: 2px;
  color: #000;
`

const InfoItemDescription = styled(TextWithoutTranslation)`
  font-size: 14;
  color: #000;
  align-self: flex-start;
  flex-wrap: wrap;
  font-family: Roboto-Regular;
`
const CarouselItem = styled.View`
  width: 95%;
  padding-horizontal: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: #fff;
  border-radius: 10px;
  margin-horizontal: 10px;
  margin-top: auto;
  margin-bottom: auto;
  elevation: 4;
`

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  avatarStyle: {
    width: 110,
    bottom: null,
    top: Platform.OS === 'ios' ? -25 : -30,
  },
})
