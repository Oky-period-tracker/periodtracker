import React from 'react'
import styled from 'styled-components/native'
import { Dimensions } from 'react-native'
import { TextWithoutTranslation, Text } from '../../components/common/Text'
import { EmojiSelector } from '../../components/common/EmojiSelector'
import { TitleText } from '../../components/common/TitleText'
import { useSelector } from '../../redux/useSelector'
import _ from 'lodash'
import * as selectors from '../../redux/selectors'
import * as actions from '../../redux/actions'
import { useDispatch } from 'react-redux'

const deviceWidth = Dimensions.get('window').width

function useQuiz() {
  const unansweredQuizzes = useSelector(selectors.quizzesWithoutAnswersSelector)

  const allQuizzes = useSelector(selectors.allQuizzesSelectors)
  const randomQuiz = React.useMemo(() => {
    if (_.isEmpty(unansweredQuizzes)) {
      return _.sample(allQuizzes)
    }
    return _.sample(unansweredQuizzes)
  }, [])
  return randomQuiz
}

export const QuizCard = React.memo<{ dataEntry: any; index: number }>(({ dataEntry, index }) => {
  const dispatch = useDispatch()
  const userID = useSelector(selectors.currentUserSelector).id
  const selectedQuestion = useQuiz()
  const answeredQuestion = useSelector((state) => selectors.quizAnswerByDate(state, dataEntry.date))

  const QuizContent = () => {
    return selectedQuestion.answers.map((item, ind) => {
      if (item.text === 'NA') return <Empty />
      return (
        <EmojiContainer key={ind}>
          <EmojiSelector
            color={'pink'}
            onPress={() =>
              dispatch(
                actions.answerQuiz({
                  id: selectedQuestion.id,
                  answerID: ind + 1,
                  question: selectedQuestion.question,
                  emoji: item.emoji,
                  answer: item.text,
                  isCorrect: item.isCorrect,
                  response: selectedQuestion.response[item.isCorrect ? 'correct' : 'in_correct'],
                  userID,
                  utcDateTime: dataEntry.date,
                }),
              )
            }
            numberOfLines={2}
            isActive={false}
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              height: 40,
              width: '100%',
              marginRight: 10,
              marginBottom: 5,
            }}
            title={item.text}
            maskStyle={{ flexDirection: 'row' }}
            emojiStyle={{ fontSize: 16 }}
            textStyle={{
              width: '85%',
              fontSize: 15,
              fontFamily: 'Roboto-Black',
              color: '#f49200',
              marginLeft: 5,
              textAlign: 'left',
            }}
            emoji={item.emoji}
          />
        </EmojiContainer>
      )
    })
  }

  const AnsweredContent = () => {
    return (
      <>
        <EmojiContainer style={{ height: 50 }}>
          <EmojiSelector
            color={answeredQuestion.isCorrect ? '#e3629b' : '#f49200'}
            onPress={() => null}
            isActive={true}
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              height: 40,
              width: '100%',
              marginRight: 10,
              marginBottom: 5,
            }}
            title={answeredQuestion.answer}
            maskStyle={{ flexDirection: 'row' }}
            emojiStyle={{ fontSize: 16 }}
            textStyle={{
              width: '85%',
              fontSize: 15,
              fontFamily: 'Roboto-Black',
              color: answeredQuestion.isCorrect ? '#e3629b' : '#f49200',
              marginLeft: 5,
              textAlign: 'left',
            }}
            emoji={answeredQuestion.emoji}
          />
        </EmojiContainer>
        <TextContainer>
          <AnswerText colorSelect={answeredQuestion.isCorrect}>
            {answeredQuestion.response}
          </AnswerText>
        </TextContainer>
      </>
    )
  }

  return (
    <QuizCardContainer
      style={{
        width: 0.9 * deviceWidth,
        height: '95%',
        alignSelf: 'center',
        marginLeft: index === 0 ? 15 : 5,
      }}
    >
      <Row style={{ height: '40%', justifyContent: 'flex-start', flexDirection: 'column' }}>
        <TitleText size={25} style={{ height: 70 }}>
          quiz
        </TitleText>
        <ContentText>daily_quiz_content</ContentText>
      </Row>
      <Row style={{ marginBottom: 10 }}>
        <InnerTitleText>
          {answeredQuestion ? answeredQuestion.question : selectedQuestion.question}
        </InnerTitleText>
      </Row>
      <Row style={{ flexDirection: 'column' }}>
        {answeredQuestion && <AnsweredContent />}
        {!answeredQuestion && <QuizContent />}
      </Row>
    </QuizCardContainer>
  )
})

const QuizCardContainer = styled.View`
  background-color: #fff;
  border-radius: 10;
  elevation: 5;
  margin-horizontal: 10;
  padding-horizontal: 40;
  padding-vertical: 30;
`

const Empty = styled.View``

const Row = styled.View`
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`

const EmojiContainer = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
`

const AnswerText = styled(TextWithoutTranslation)<{ colorSelect: boolean }>`
  font-size: 13;
  width: 100%;
  font-family: Roboto-Black;
  text-align: left;
  color: ${(props) => (props.colorSelect ? '#e3629b' : '#f49200')};
`
const TextContainer = styled.View`
  height: 95;
  margin-top: 5;
  width: 100%;
  overflow: hidden;
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
