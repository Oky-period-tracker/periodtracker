import React from 'react'
import { PageContainer } from '../components/layout/PageContainer'
import { BackgroundTheme } from '../components/layout/BackgroundTheme'
import { JourneyCard } from './journeyScreen/JourneyCard'
import { Header } from '../components/common/Header'
import { FinalJourneyCard } from './journeyScreen/FinalJourneyCard'
import { SwiperContainer } from '../components/common/SwiperContainer'
import styled from 'styled-components/native'
import moment from 'moment'
import { assets } from '../assets'

const cards = [
  {
    id: 1,
    question: 'survey_question_1',
    description: 'survey_description',
    image: assets.static.icons.profileL,
    pickerLabel: null,
    initialOption: 'No',
    pickerType: 'non_period',
    defaultAnswerMessage: 'survey_default_answer_1',
    confirmMessage: 'survey_default_answer_1_1',
    leftButtonTitle: 'no',
    rightButtonTitle: 'yes',
    answerType: 'string',
  },
  {
    id: 2,
    question: 'survey_question_2',
    description: 'survey_description',
    image: assets.static.icons.calendarL,
    pickerLabel: 'survey_label_2',
    pickerType: 'calendar',
    initialOption: moment
      .utc()
      .startOf('day')
      .clone()
      .subtract(14, 'days')
      .format('DD-MMM-YYYY'),
    defaultAnswerMessage: 'survey_default_answer_2',
    confirmMessage: null,
    answerType: 'date',
  },
  {
    id: 3,
    question: 'survey_question_3',
    description: 'survey_description',
    image: assets.static.icons.news,
    pickerLabel: 'survey_label_3',
    pickerType: 'options',
    optionsRange: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    optionsUnit: ['day', 'days'],
    initialOption: 4,
    defaultAnswerMessage: 'survey_default_answer_3',
    confirmMessage: null,
    answerType: 'numeric',
  },
  {
    id: 4,
    question: 'survey_question_4',
    description: 'survey_description',
    image: assets.static.icons.send,
    pickerLabel: 'survey_label_4',
    pickerType: 'options',
    optionsRange: [1, 2, 3, 4, 5, 6],
    optionsUnit: ['week', 'weeks'],
    initialOption: 2,
    defaultAnswerMessage: 'survey_default_answer_4',
    confirmMessage: null,
    answerType: 'numeric',
  },
]

export function JourneyScreen() {
  let earlyFinishCheck = false
  const swiper = React.useRef(null)
  const [questionStatuses, setQuestionStatus] = React.useState({
    data: cards.map(card => ({ id: card.id, status: 'initial' })),
  })
  const [questionAnswers, setQuestionAnswer] = React.useState({
    data: cards.map(card => ({ id: card.id, answer: card.initialOption })),
  })
  const [currentQuestionIndex, setQuestionIndex] = React.useState(0)
  const [isSurveyCompleted, setSurveyCompleted] = React.useState(false)

  const goToTheNext = () => {
    let nextIndexQuestionIndex = currentQuestionIndex + 1
    if (nextIndexQuestionIndex === 4) {
      setSurveyCompleted(true)
    }
    if (earlyFinishCheck) {
      setSurveyCompleted(true)
    }
    setQuestionStatus({
      data: questionStatuses.data.map((item, index) =>
        index === nextIndexQuestionIndex || index === currentQuestionIndex
          ? { ...item, status: 'initial' }
          : item,
      ),
    })
    setQuestionIndex(nextIndexQuestionIndex)
    if (isSurveyCompleted) nextIndexQuestionIndex = 4
    earlyFinishCheck
      ? swiper.current.scrollBy(4)
      : swiper.current.scrollBy(nextIndexQuestionIndex - currentQuestionIndex)
    if (earlyFinishCheck) {
      earlyFinishCheck = false
      setSurveyCompleted(false)
    }
  }

  const goToQuestion = questionNumber => {
    setQuestionIndex(questionNumber - 1)
    setQuestionStatus({
      data: questionStatuses.data.map((item, _) =>
        item.id === questionNumber ? { ...item, status: 'initial' } : item,
      ),
    })
    swiper.current.scrollBy(questionNumber - 5)
  }

  return (
    <BackgroundTheme>
      <PageContainer>
        <Header showScreenTitle={false} screenTitle="" showGoBackButton={false} />
        <Container>
          <SwiperContainer
            setIndex={ind => setQuestionIndex(ind)}
            scrollEnabled={true}
            pagingEnabled={true}
            ref={swiper}
          >
            {[
              ...cards.map((card, index) => {
                return (
                  <JourneyCard
                    key={card.id}
                    {...card}
                    status={questionStatuses.data[index].status}
                    onRemember={() => {
                      setQuestionStatus({
                        data: questionStatuses.data.map(item =>
                          item.id === card.id ? { ...item, status: 'remember' } : item,
                        ),
                      })
                    }}
                    onForget={() => {
                      setQuestionStatus({
                        data: questionStatuses.data.map(item =>
                          item.id === card.id
                            ? { ...item, status: card.pickerType ? 'not_remember' : 'remember' }
                            : item,
                        ),
                      })
                    }}
                    onChange={() => {
                      setQuestionStatus({
                        data: questionStatuses.data.map(item =>
                          item.id === card.id ? { ...item, status: 'remember' } : item,
                        ),
                      })
                    }}
                    onConfirm={() => {
                      if (card.pickerType === 'non_period') {
                        setQuestionAnswer({
                          data: questionAnswers.data.map(item =>
                            item.id === card.id ? { ...item, answer: 'Yes' } : item,
                          ),
                        })
                        if (
                          questionStatuses.data[0].id === card.id &&
                          questionStatuses.data[0].status === 'not_remember'
                        ) {
                          setQuestionAnswer({
                            data: questionAnswers.data.map(item =>
                              item.id === card.id ? { ...item, answer: 'No' } : item,
                            ),
                          })
                          earlyFinishCheck = true
                        }
                      }
                      goToTheNext()
                    }}
                    questionAnswer={questionAnswers.data[index].answer}
                    setQuestionAnswer={setQuestionAnswer}
                    answersData={questionAnswers}
                    defaultAnswerMessage={card.defaultAnswerMessage}
                    confirmMessage={card.confirmMessage}
                  />
                )
              }),
              <FinalJourneyCard
                goToQuestion={goToQuestion}
                questionAnswers={questionAnswers}
                cards={cards}
                key={5}
              />,
            ]}
          </SwiperContainer>
        </Container>
      </PageContainer>
    </BackgroundTheme>
  )
}

const Container = styled.View`
  flex: 1;
  position: absolute;
  left: 0;
  right: 0;
  top: 35;
  bottom: 5;
`
