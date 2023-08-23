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
import { Dimensions } from 'react-native'
const width = Dimensions.get('window').width
const imageWidth = width - 30
export const AboutScreen = ({ navigation }) => {
  const aboutContent = useSelector(selectors.aboutContent)
  const aboutBanner = useSelector(selectors.aboutBanner)

  useTextToSpeechHook({ navigation, text: aboutScreenText() })

  return (
    <BackgroundTheme>
      <PageContainer showsVerticalScrollIndicator={false}>
        <Header style={{ paddingLeft: 10, paddingRight: 15 }} screenTitle="about" />
        <Container>
          <ImagesContainer>
            <Icon
              style={{ width: imageWidth, height: imageWidth / 2, resizeMode: 'contain' }}
              source={{ uri: aboutBanner }}
            />
          </ImagesContainer>
          {aboutContent.map((item, ind) => {
            if (item.type === 'HEADING') {
              return <HeadingText>{item.content}</HeadingText>
            }
            if (item.type === 'CONTENT') {
              return (
                <TextStyle style={[ind === aboutContent.length - 1 && { paddingBottom: 30 }]}>
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
  padding-top: 30px;
  padding-bottom: 30px;
  width: 100%;
  background-color: #fff;
`

const PageContainer = styled.ScrollView``
