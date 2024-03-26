import React from 'react'
import styled from 'styled-components/native'
import { BackgroundTheme } from '../../components/layout/BackgroundTheme'
import { Header } from '../../components/common/Header'
import { TextWithoutTranslation } from '../../components/common/Text'
import { ScrollView, StyleSheet } from 'react-native'
import { useSelector } from '../../hooks/useSelector'
import * as selectors from '../../redux/selectors'
import { chunk } from 'lodash'
import { useTextToSpeechHook } from '../../hooks/useTextToSpeechHook'
import { useScreenDimensions } from '../../hooks/useScreenDimensions'

export function PrivacyScreen({ navigation }) {
  const { screenWidth: width } = useScreenDimensions()
  const [page, setPage] = React.useState(0)
  const privacyContent = useSelector(selectors.privacyContent)

  const speechText = privacyContent.map((item) => item.content)
  const content = privacyContent.map((item, i) => {
    const isLast = i === privacyContent.length - 1

    if (item.type === 'HEADING') {
      return <HeadingText key={`privacy_item_${i}`}>{item.content}</HeadingText>
    }
    if (item.type === 'CONTENT') {
      return (
        <ContentText key={`privacy_item_${i}`} style={isLast && styles.last}>
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
        horizontal
        onMomentumScrollEnd={(event) => {
          setPage(Math.round(event.nativeEvent.contentOffset.x / width))
        }}
        style={styles.flex}
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
      <DotsRow>
        {new Array(numPages).fill(0).map((item, index) => {
          return <Circle key={index} isHighlighted={index === page} />
        })}
      </DotsRow>
    </BackgroundTheme>
  )
}

const Container = ({ children, page }) => {
  const { screenWidth: width } = useScreenDimensions()
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
  border-radius: 10px;
  padding: 40px;
  background-color: #fff;
  elevation: 2;
  margin-bottom: 28px;
  margin-horizontal: 12px;
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

const DotsRow = styled.View`
  position: absolute;
  width: 90%;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  bottom: 20px;
  align-self: center;
  flex-direction: row;
`

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  last: {
    paddingBottom: 30,
  },
})
