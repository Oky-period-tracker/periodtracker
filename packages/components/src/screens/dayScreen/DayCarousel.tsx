import React from 'react'
import _ from 'lodash'
import { FlatList, Dimensions, KeyboardAvoidingView } from 'react-native'
import { DayCarouselItem } from './DayCarouselItem'
import { useDispatch } from 'react-redux'
import * as actions from '../../redux/actions'
import { NoteCard } from './NoteCard'
import { QuizCard } from './QuizCard'
import { DidYouKnowCard } from './DidYouKnowCard'
import { SurveyCard } from './SurveyCard'
import { useSelector } from '../../redux/useSelector'
import * as selectors from '../../redux/selectors'
import { useTextToSpeechHook } from '../../hooks/useTextToSpeechHook'
import { translate } from '../../i18n'
import { ThemedModal } from '../../components/common/ThemedModal'
import { ColourButtons } from '../mainScreen/ColourButtons'
import { SpinLoader } from '../../components/common/SpinLoader'
import { navigateAndReset } from '../../services/navigationService'

const screenWidth = Dimensions.get('window').width
// TODO_ALEX: survey
export function DayCarousel({ navigation, dataEntry }) {
  const dispatch = useDispatch()
  const [textToSpeak, setTextToSpeak] = React.useState([])
  const [isVisible, setIsVisible] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [tempCardName, setTempCardName] = React.useState(null)
  const [tempCardAnswer, setTempCardAnswer] = React.useState(null)
  const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 })
  const userID = useSelector(selectors.currentUserSelector).id
  const allSurveys = useSelector(selectors.allSurveys)
  const completedSurveys = useSelector(selectors.completedSurveys)
  const newSurveys = allSurveys?.length ? allSurveys[0] : null

  const cards = {
    // ...((!_.isEmpty(unansweredSurveys) || answeredSurvey) && { survey: null }),
    ...(dataEntry.date.day() % 2 === 0 && !dataEntry.onPeriod && { quiz: null }), // this is to change the order of cards based on the day (it alternates between days and when on periods the quiz cards should go to the end)
    ...(dataEntry.date.day() % 2 !== 0 && !dataEntry.onPeriod && { didYouKnow: null }),
    // TODO_ALEX: move into submodule?
    mood: {
      happy: '😊',
      blah: '😑',
      sad: '😔',
      stressed: '😤',
      worried: '😟',
      fabulous: '😎',
    },
    body: {
      tired: '💤',
      cramps: '💥',
      bloating: '🎈',
      spots: '💢',
      headache: '⚡',
      sore_breasts: '🍒',
    },
    activity: {
      exercise: '🏃',
      'healthy food': '🍏',
      'good sleep': '🛏️',
      socialising: '👋',
      "couldn't sleep": '😴',
      'unhealthy food': '🍰',
    },
    flow: {
      none: '🌂',
      spotting: '🔹',
      light: '💧',
      medium: '💦',
      heavy: '☔',
    },
    ...(dataEntry.date.day() % 2 === 0 && dataEntry.onPeriod && { quiz: null }),
    ...(dataEntry.date.day() % 2 !== 0 && dataEntry.onPeriod && { didYouKnow: null }),
    notes: null,
  }

  const [endSurvey, setEndSurvey] = React.useState(false)
  const [surveyTempQuestions, setSurveyTempQuestions] = React.useState(null)
  const [currentSurveyQuestionIndex, setCurrentQuestionIndex] = React.useState(null)
  const [answeredSurvey, setAnsweredSurveyQuestions] = React.useState(null)
  const lastQuestion = {
    question: translate('thank_you_msg'),
    options: null,
    is_multiple: false,
    next_question: null,
    endSurvey: true,
  }

  React.useEffect(() => {
    const dayCardText = Object.keys(cards).reduce((acc, item) => {
      let heading = ''
      let caption = ''
      let subheading = ''
      if (item === 'quiz') {
        heading = translate('quiz')
        caption = translate('daily_quiz_content')
        return acc.concat([heading, caption])
      }
      if (item === 'didYouKnow') {
        heading = translate('didYouKnow')
        caption = translate('daily_didYouKnow_content')
        return acc.concat([heading, caption])
      }
      if (item === 'survey') {
        heading = translate('survey')
        caption = translate('daily_survey_content')
        return acc.concat([heading, caption])
      }
      if (item === 'notes') {
        return acc
      }
      heading = translate(item)
      caption = translate(contentText[item])
      subheading = translate(headingText[item])
      const emojis = Object.keys(cards[item]).map((key) => translate(key))
      return acc.concat([heading, caption, subheading, ...emojis])
    }, [])
    setTextToSpeak(dayCardText)
    updateSurveyQuestion()
    return () => {
      setSurveyTempQuestions({}) // This worked for me
    }
  }, [])

  const updateSurveyQuestion = () => {
    // No new surveys
    if (!newSurveys?.questions?.length) {
      setEndSurvey(true)
      return
    }

    // Survey in progress
    if (newSurveys?.inProgress) {
      const { currentQuestionIndex, questions } = newSurveys
      let currentQuestion = null
      questions.forEach((element, index) => {
        if (index === currentQuestionIndex) {
          currentQuestion = element
        }
      })
      setSurveyTempQuestions(currentQuestion)
      setCurrentQuestionIndex(currentQuestionIndex)
      setAnsweredSurveyQuestions(newSurveys.answeredQuestion)
      return
    }

    // Start new survey
    setSurveyTempQuestions({
      question: translate('will_you_answer_survey_questions'),
      options: [{ option1: translate('Yes') }, { option2: translate('not_now') }],
      response: 'response',
      is_multiple: true,
      next_question: {
        option1: '2',
      },
      thankYouMsg: translate('thank_you_msg'),
      sort_number: '1',
      utcDateTime: dataEntry.date,
      surveyId: newSurveys?.id,
    })
  }

  useTextToSpeechHook({ navigation, text: textToSpeak })

  const navigateToTutorial = () => {
    setLoading(true)
    requestAnimationFrame(() => {
      navigateAndReset('TutorialFirstStack', null)
    })
  }
  const onEndSurvey = () => {
    setEndSurvey(true)
  }
  const onOpenAnswer = (openAnswer) => {
    const currQuestion = surveyTempQuestions
    const tempAnswer = answeredSurvey ? answeredSurvey : []
    // prettier-ignore
    tempAnswer.push({
      "questionId": currQuestion?.id || '',
      "question": currQuestion?.question,
      "answerID": '',
      "answer": openAnswer,
      "response": currQuestion?.response,
      "isMultiple": currQuestion?.is_multiple
    })
    setAnsweredSurveyQuestions(tempAnswer)
    getNextQuestion(currQuestion, true, 0, tempAnswer)
  }
  const onSelectSurvey = (isProcced, selectedOption, selectedOptionIndex) => {
    if (isProcced) {
      const currQuestion = surveyTempQuestions
      if (isProcced && currentSurveyQuestionIndex === null) {
        setCurrentQuestionIndex(0)
        // prettier-ignore
        setSurveyTempQuestions(newSurveys?.questions[0])
      } else {
        getNextQuestion(currQuestion, isProcced, selectedOptionIndex, null)
      }
    }
  }

  const getNextQuestion = (currQuestion, isProcced, selectedOptionIndex, answersArray) => {
    if (currQuestion?.next_question) {
      const nextQuestionKeys = Object.keys(currQuestion.next_question)
      const nextQuestionValues = Object.values(currQuestion.next_question)
      const tempAnswer = answeredSurvey ? answeredSurvey : []
      if (currQuestion?.is_multiple) {
        const optionnKeys = Object.keys(currQuestion.options[selectedOptionIndex])
        const optionnValues = Object.values(currQuestion.options[selectedOptionIndex])
        tempAnswer.push({
          questionId: currQuestion?.id || '',
          question: currQuestion?.question,
          answerID: (selectedOptionIndex + 1).toString(),
          answer: optionnValues[0],
          response: currQuestion?.response,
          isMultiple: currQuestion?.is_multiple,
        })
        setAnsweredSurveyQuestions(tempAnswer)
      }
      if (
        nextQuestionValues.join('').replace(/\s/gi, '').length === 0 ||
        nextQuestionValues[selectedOptionIndex] === ''
      ) {
        setSurveyTempQuestions(lastQuestion)
        setTimeout(() => {
          setEndSurvey(true)
        }, 5000)
        dispatch(
          actions.answerSurvey({
            id: newSurveys?.id,
            isCompleted: true,
            isSurveyAnswered: true,
            questions: answeredSurvey,
            user_id: userID,
            utcDateTime: dataEntry.date,
          }),
        )
        setTimeout(() => {
          if (allSurveys?.length) {
            const tempData = allSurveys
            const tempCompletedSurveys = completedSurveys ? completedSurveys : []
            dispatch(actions.updateCompletedSurveys([tempData[0], ...tempCompletedSurveys]))

            tempData.shift()
            dispatch(actions.updateAllSurveyContent(tempData))
          }
        }, 2000)
      } else {
        let nextQuestionIndex
        // prettier-ignore
        nextQuestionKeys?.forEach((item, index) => {
          return index === selectedOptionIndex ? nextQuestionIndex = nextQuestionValues[selectedOptionIndex] : null
        })

        // prettier-ignore
        const currentQuestion = newSurveys?.questions[nextQuestionIndex - 1]
        setCurrentQuestionIndex(nextQuestionIndex)
        setSurveyTempQuestions(currentQuestion)
        const currentSurvey = allSurveys[0]
        currentSurvey.inProgress = true
        currentSurvey.currentQuestionIndex = nextQuestionIndex - 1
        currentSurvey.answeredQuestion = currQuestion?.is_multiple ? tempAnswer : answersArray
        const tempData = [...allSurveys]
        tempData[0] = currentSurvey
        dispatch(actions.updateAllSurveyContent(tempData))
      }
    }
  }

  return (
    <KeyboardAvoidingView behavior="position">
      {!endSurvey ? (
        <FlatList
          horizontal={true}
          decelerationRate={0}
          snapToInterval={0.9 * screenWidth + 15}
          snapToAlignment={'center'}
          pagingEnabled={true}
          data={[surveyTempQuestions]}
          extraData={[surveyTempQuestions]}
          keyExtractor={(_ignore, index) => index.toString()}
          viewabilityConfig={viewConfigRef.current}
          renderItem={({ item, index }) => {
            return (
              <SurveyCard
                dataEntry={item}
                index={index}
                selectAnswer={item?.is_multiple ? onSelectSurvey : onOpenAnswer}
                startSurveyQuestion={currentSurveyQuestionIndex === null ? false : true}
                endSurvey={onEndSurvey}
              />
            )
          }}
          style={{ width: screenWidth }}
          showsHorizontalScrollIndicator={false}
          removeClippedSubviews={false}
        />
      ) : (
        <FlatList
          horizontal={true}
          decelerationRate={0}
          snapToInterval={0.9 * screenWidth + 15}
          snapToAlignment={'center'}
          pagingEnabled={true}
          data={Object.keys(cards)}
          keyExtractor={(_ignore, index) => index.toString()}
          viewabilityConfig={viewConfigRef.current}
          renderItem={({ item, index }) => {
            if (item === 'notes') {
              return <NoteCard dataEntry={dataEntry} />
            }
            if (item === 'quiz') {
              return <QuizCard index={index} dataEntry={dataEntry} />
            }
            if (item === 'didYouKnow') {
              return <DidYouKnowCard index={index} />
            }

            return (
              <DayCarouselItem
                index={index}
                content={cards[item]}
                cardName={item}
                dataEntry={dataEntry}
                onPress={(cardName, answer) => {
                  if (
                    // To change period based on flow input
                    ((answer === 'light' || answer === 'medium' || answer === 'heavy') &&
                      !dataEntry.onPeriod) ||
                    ((answer === 'none' || answer === 'spotting') && dataEntry.onPeriod)
                  ) {
                    setTempCardName(cardName)
                    setTempCardAnswer(answer)
                    setIsVisible(true)
                    dispatch(
                      actions.answerDailyCard({
                        cardName: tempCardName,
                        answer: tempCardAnswer,
                        userID,
                        utcDateTime: dataEntry.date,
                        mutuallyExclusive: cardName === 'flow',
                        periodDay: dataEntry.onPeriod,
                      }),
                    )
                    return
                  }
                  dispatch(
                    actions.answerDailyCard({
                      cardName,
                      answer,
                      userID,
                      utcDateTime: dataEntry.date,
                      mutuallyExclusive: cardName === 'flow',
                      periodDay: dataEntry.onPeriod,
                    }),
                  )
                }}
              />
            )
          }}
          style={{ width: screenWidth }}
          showsHorizontalScrollIndicator={false}
        />
      )}

      <ThemedModal {...{ isVisible, setIsVisible }}>
        <ColourButtons
          isDayCard
          navigateToTutorial={navigateToTutorial}
          inputDay={dataEntry.date}
          hide={() => {
            setIsVisible(false)
            dispatch(
              actions.answerDailyCard({
                cardName: tempCardName,
                answer: tempCardAnswer,
                userID,
                utcDateTime: dataEntry.date,
                mutuallyExclusive: tempCardName === 'flow',
                periodDay: dataEntry.onPeriod,
              }),
            )
          }}
          isCalendar={false}
          onPress={() => {
            setIsVisible(false)
          }}
          selectedDayInfo={dataEntry}
          cardValues={null}
        />
      </ThemedModal>
      <SpinLoader isVisible={loading} setIsVisible={setLoading} text="please_wait_tutorial" />
    </KeyboardAvoidingView>
  )
}

const contentText = {
  mood: 'daily_mood_content',
  body: 'daily_body_content',
  activity: 'daily_activity_content',
  flow: 'daily_flow_content',
  // survey: 'daily_survey_content',
  // notes: 'daily_notes_content',
}
const headingText = {
  mood: 'daily_mood_heading',
  body: 'daily_body_heading',
  activity: 'daily_activity_heading',
  flow: 'daily_flow_heading',
  survey: 'daily_survey_heading',
  notes: 'daily_notes_heading',
}
