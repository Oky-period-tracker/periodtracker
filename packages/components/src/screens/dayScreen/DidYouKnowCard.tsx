import React from 'react'
import { Dimensions } from 'react-native'
import styled from 'styled-components/native'
import { TextWithoutTranslation, Text } from '../../components/common/Text'
import { useSelector } from '../../hooks/useSelector'
import _ from 'lodash'
import * as selectors from '../../redux/selectors'
import { TitleText } from '../../components/common/TitleText'

const deviceWidth = Dimensions.get('window').width

function useDidYouKnow() {
  const allDidYouKnows = useSelector(selectors.allDidYouKnowsSelectors)
  const randomDidYouKnow = React.useMemo(() => {
    return _.sample(allDidYouKnows)
  }, [])
  return randomDidYouKnow
}

export const DidYouKnowCard = React.memo<{ index: number }>(({ index }) => {
  const selectedDidYouKnow = useDidYouKnow()
  if (!selectedDidYouKnow) {
    return null
  }

  return (
    <DidYouKnowCardContainer
      style={{
        width: 0.9 * deviceWidth,
        height: '95%',
        alignSelf: 'center',
        marginLeft: index === 0 ? 15 : 5,
      }}
    >
      <Row style={{ height: '40%', justifyContent: 'flex-start', flexDirection: 'column' }}>
        <TitleContainer>
          <TitleText size={25}>didYouKnow</TitleText>
        </TitleContainer>
        <ContentText>daily_didYouKnow_content</ContentText>
      </Row>
      <Row style={{ marginBottom: 10 }}>
        <InnerTitleText>{selectedDidYouKnow.title}</InnerTitleText>
      </Row>
      <Row style={{ height: '45%', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <TextContainer>
          <AnswerText>{selectedDidYouKnow.content}</AnswerText>
        </TextContainer>
      </Row>
    </DidYouKnowCardContainer>
  )
})

const DidYouKnowCardContainer = styled.View`
  background-color: #fff;
  border-radius: 10px;
  elevation: 5;
  margin-horizontal: 10px;
  padding-horizontal: 40;
  padding-vertical: 30;
`

const Row = styled.View`
  width: 100%;
  justify-content: center;
`

const AnswerText = styled(TextWithoutTranslation)`
  font-size: 15;
  text-align: left;
  font-family: Roboto-Black;
  color: #e3629b;
`
const TextContainer = styled.View`
  width: 100%;
`

const TitleContainer = styled.View`
  width: 100%;
  margin-bottom: 10;
`

const InnerTitleText = styled(TextWithoutTranslation)`
  flex: 1;
  font-size: 18;
  color: #f49200;
  font-family: Roboto-Black;
`
const ContentText = styled(Text)`
  width: 100%;
  color: #4d4d4d;
  font-size: 12;
  text-align: left;
`
