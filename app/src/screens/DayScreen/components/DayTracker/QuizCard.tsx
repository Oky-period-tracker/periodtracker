import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { DisplayButton } from '../../../../components/Button'
import { Text } from '../../../../components/Text'
import { useDispatch } from 'react-redux'
import {
  allQuizzesSelectors,
  currentUserSelector,
  quizAnswerByDate,
  quizzesWithoutAnswersSelector,
} from '../../../../redux/selectors'
import _ from 'lodash'
import { DayData } from '../../../MainScreen/DayScrollContext'
import { answerQuiz } from '../../../../redux/actions'
import { useSelector } from '../../../../redux/useSelector'
import { useColor } from '../../../../hooks/useColor'

export const QuizCard = ({ dataEntry }: { dataEntry: DayData }) => {
  const userID = useSelector(currentUserSelector)?.id
  const { palette, backgroundColor } = useColor()

  const selectedQuestion = useQuiz()
  const answeredQuestion = useSelector((state) => quizAnswerByDate(state, dataEntry.date)) as {
    id: string
    question: string
    // emoji: string;
    answer: string
    isCorrect: boolean
    response: string
    utcDateTime: string
  } // TODO:

  const dispatch = useDispatch()

  const question = answeredQuestion ? answeredQuestion.question : selectedQuestion?.question

  if (!selectedQuestion || !userID) {
    return null // TODO: ?
  }

  return (
    <View style={[styles.page, { backgroundColor }]}>
      <Text style={[styles.title, { color: palette.secondary.text }]}>quiz</Text>
      <Text>daily_quiz_content</Text>
      <View style={styles.body}>
        <Text style={[styles.question, { color: palette.secondary.text }]} enableTranslate={false}>
          {question}
        </Text>
        {answeredQuestion && (
          <>
            <View style={styles.checkboxContainer}>
              <DisplayButton
                style={styles.checkbox}
                status={answeredQuestion.isCorrect ? 'primary' : 'secondary'}
              />
              <Text
                status={answeredQuestion.isCorrect ? 'primary' : 'secondary'}
                style={styles.label}
                enableTranslate={false}
              >
                {answeredQuestion.answer}
              </Text>
            </View>
            <Text
              style={styles.response}
              status={answeredQuestion.isCorrect ? 'primary' : 'secondary'}
              enableTranslate={false}
            >
              {answeredQuestion.response}
            </Text>
          </>
        )}
        {!answeredQuestion &&
          selectedQuestion.answers.map((answer, index) => {
            const onPress = () => {
              dispatch(
                answerQuiz({
                  id: selectedQuestion.id,
                  answerID: index + 1,
                  question: selectedQuestion.question,
                  emoji: '', //TODO: answer.emoji ?
                  answer: answer.text,
                  isCorrect: answer.isCorrect,
                  response: selectedQuestion.response[answer.isCorrect ? 'correct' : 'in_correct'],
                  userID,
                  utcDateTime: dataEntry.date,
                }),
              )
            }

            return (
              <TouchableOpacity
                key={answer.text}
                onPress={onPress}
                style={styles.checkboxContainer}
              >
                <DisplayButton style={styles.checkbox} status={'basic'} />
                <Text status={'basic'} style={styles.label} enableTranslate={false}>
                  {answer.text}
                </Text>
              </TouchableOpacity>
            )
          })}
      </View>
    </View>
  )
}

const useQuiz = () => {
  const unansweredQuizzes = useSelector(quizzesWithoutAnswersSelector)

  const allQuizzes = useSelector(allQuizzesSelectors)
  const randomQuiz = React.useMemo(() => {
    if (_.isEmpty(unansweredQuizzes)) {
      return _.sample(allQuizzes)
    }
    return _.sample(unansweredQuizzes)
  }, [])
  return randomQuiz
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    padding: 24,
    maxWidth: 800,
    borderRadius: 20,
  },
  button: {
    marginLeft: 'auto',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  body: {
    flex: 1,
    justifyContent: 'center',
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 40,
    height: 40,
    marginRight: 12,
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
  },
  response: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 'auto',
    textAlign: 'center',
  },
})
