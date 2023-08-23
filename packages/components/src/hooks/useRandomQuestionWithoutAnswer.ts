import moment from 'moment'
import { useSelector } from './useSelector'
import * as selectors from '../redux/selectors'

export function useRandomQuestionWithoutAnswer(day?: number) {
  const questionOfTheDay = day || moment().day()

  // const surveysWithoutAnswers = useSelector(
  //   selectors.surveysWithoutAnswersSelector,
  // )

  const quizzesWithoutAnswers = useSelector(selectors.quizzesWithoutAnswersSelector)

  // const selectedSurveyIndex = questionOfTheDay % surveysWithoutAnswers.length
  const selectedQuizIndex = questionOfTheDay % quizzesWithoutAnswers.length

  return {
    // survey: surveysWithoutAnswers[selectedSurveyIndex],
    quiz: quizzesWithoutAnswers[selectedQuizIndex],
  }
}
