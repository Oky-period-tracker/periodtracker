import React from 'react'
import styled from 'styled-components/native'
import { BackgroundTheme } from '../../components/layout/BackgroundTheme'
import { TextWithoutTranslation } from '../../components/common/Text'
import { Header } from '../../components/common/Header'
import { Icon } from '../../components/common/Icon'
import { useSelector } from '../../hooks/useSelector'
import * as selectors from '../../redux/selectors'
import { useTextToSpeechHook } from '../../hooks/useTextToSpeechHook'
import { aboutScreenText } from '../../config'
import { StyleSheet } from 'react-native'
import { assets } from '../../assets'

export const AboutScreen = ({ navigation }) => {
  const aboutContent = useSelector(selectors.aboutContent)
  const aboutBanner = useSelector(selectors.aboutBanner)
  const locale = useSelector(selectors.currentLocaleSelector)

  // TODO:PH ph has 2 about banner images, need to combine into 1 image
  const iconSource = aboutBanner ? { uri: aboutBanner } : assets.general.aboutBanner[locale]

  useTextToSpeechHook({ navigation, text: aboutScreenText() })

  return (
    <BackgroundTheme>
      <PageContainer showsVerticalScrollIndicator={false}>
        <Header style={styles.header} screenTitle="about" />
        <Container>
          <ImagesContainer>
            <Icon style={styles.icon} source={iconSource} />
          </ImagesContainer>
          {aboutContent.map((item, i) => {
            const isLast = i === aboutContent.length - 1
            if (item.type === 'HEADING') {
              return <HeadingText key={`content_item_${i}`}>{item.content}</HeadingText>
            }
            if (item.type === 'CONTENT') {
              return (
                <TextStyle key={`content_item_${i}`} style={isLast && styles.lastItem}>
                  {item.content}
                </TextStyle>
              )
            }
          })}
        </Container>
      </PageContainer>
    </BackgroundTheme>
  )
}

const Container = styled.View`
  border-radius: 10px;
  elevation: 2;
  flex: 1;
  margin-bottom: 30px;
  margin-horizontal: 10px;
  flex-direction: column;
  overflow: hidden;
  background-color: #fff;
`
// The reason the text has background colour and not a view was because of a bug on old versions of android and react native UIView
// this bug would cause views greater than a few thousand pixels the view colour would make itself transparent

const HeadingText = styled(TextWithoutTranslation)`
  padding-left: 42px;
  padding-right: 42px;
  font-size: 16;
  padding-bottom: 10px;
  font-family: Roboto-Black;
  text-align: justify;
  color: #4d4d4d;
  background-color: #fff;
`
const TextStyle = styled(TextWithoutTranslation)`
  padding-left: 42px;
  padding-right: 42px;
  padding-bottom: 10px;
  font-size: 16;
  text-align: justify;
  color: #4d4d4d;
  background-color: #fff;
`

const ImagesContainer = styled.View`
  align-items: center;
  padding: 28px;
  width: 100%;
  background-color: #fff;
`

const PageContainer = styled.ScrollView``

const styles = StyleSheet.create({
  header: {
    paddingLeft: 10,
    paddingRight: 15,
  },
  icon: {
    resizeMode: 'contain',
    width: '100%',
    height: 200,
  },
  lastItem: {
    paddingBottom: 30,
  },
})
