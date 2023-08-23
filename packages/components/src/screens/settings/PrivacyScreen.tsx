import React from 'react'
import styled from 'styled-components/native'
import { BackgroundTheme } from '../../components/layout/BackgroundTheme'
import { Header } from '../../components/common/Header'
import { TextWithoutTranslation } from '../../components/common/Text'
import { ScrollView, Dimensions } from 'react-native'
import { useSelector } from '../../hooks/useSelector'
import * as selectors from '../../redux/selectors'
import { chunk } from 'lodash'
import { useTextToSpeechHook } from '../../hooks/useTextToSpeechHook'

const width = Dimensions.get('window').width
export function PrivacyScreen({ navigation }) {
  const [page, setPage] = React.useState(0)
  const privacyContent = useSelector(selectors.privacyContent)
  const speechText = privacyContent.map((item) => item.content)
  const content = privacyContent.map((item, ind) => {
    if (item.type === 'HEADING') {
      return <HeadingText>{item.content}</HeadingText>
    }
    if (item.type === 'CONTENT') {
      return (
        <ContentText style={[ind === privacyContent.length - 1 && { paddingBottom: 30 }]}>
          {item.content}
        </ContentText>
      )
    }
  })

  const itemsPerPage = 4
  const chunks = chunk(content, itemsPerPage)
  const numPages = chunks.length
  useTextToSpeechHook({ navigation, text: speechText })

  return (
    <BackgroundTheme>
      <Header screenTitle="privacy_policy" />
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ width: numPages * width }}
        horizontal
        onMomentumScrollEnd={(event) => {
          setPage(Math.round(event.nativeEvent.contentOffset.x / width))
        }}
        style={{ flex: 1 }}
        scrollEnabled={true}
        pagingEnabled={true}
      >
        {chunks.map((contentGroup, index) => {
          return (
            <Container key={index} page={page}>
              {contentGroup}
            </Container>
          )
        })}
      </ScrollView>
      <Buttons>
        {new Array(numPages).fill(0).map((item, index) => {
          return <Circle key={index} isHighlighted={index === page} />
        })}
      </Buttons>
    </BackgroundTheme>
  )
}

const Container = ({ children, page }) => {
  const scrollRef = React.useRef(null)

  React.useEffect(() => {
    if (scrollRef === null) return
    scrollRef.current.scrollTo({ y: 0 }) // resets the page
  }, [page])

  return (
    <ScrollContainer
      style={{ width }}
      contentContainerStyle={{ width }}
      ref={scrollRef}
      showsVerticalScrollIndicator={false}
    >
      <ViewContainer>{children}</ViewContainer>
    </ScrollContainer>
  )
}

const ScrollContainer = styled.ScrollView`
  height: 100%;
`
const Buttons = styled.View`
  position: absolute;
  width: 90%;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  bottom: 20px;
  align-self: center;
  flex-direction: row;
`

const Circle = styled.View<{ isHighlighted: boolean }>`
  height: 15px;
  width: 15px;
  margin-horizontal: 2.5px;
  margin-bottom: 2.5px;
  border-radius: 10px;
  elevation: ${(props) => (props.isHighlighted ? 5 : 2)};
  background-color: ${(props) => (props.isHighlighted ? '#f9c7c1' : `#efefef`)};
`

const ViewContainer = styled.View`
  width: ${width * 0.95};
  border-radius: 10px;
  padding-left: 42px;
  padding-right: 42px;
  background-color: #fff;
  padding-top: 40px;
  padding-bottom: 40px;
  elevation: 2;
  margin-bottom: 30px;
  margin-left: auto;
  margin-right: auto;
`

const ContentText = styled(TextWithoutTranslation)`
  font-size: 14;
  color: #4d4d4d;
  margin-bottom: 10px;
  width: 100%;
  text-align: left;
`
const HeadingText = styled(TextWithoutTranslation)`
  font-size: 16;
  font-family: Roboto-Black;
  text-align: left;
  color: #4d4d4d;
  width: 100%;
  margin-bottom: 10px;
`
