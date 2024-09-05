import React from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from '../../../../redux/useSelector'
import { currentUserSelector } from '../../../../redux/selectors'
import { User } from '../../../../redux/reducers/authReducer'
import { answerSurvey } from '../../../../redux/actions'
import moment from 'moment'
import { Survey, SurveyQuestion, SurveyQuestionAnswer } from '../../../../core/types'

type SurveyState = {
  survey: Survey | undefined
  agree: boolean | null
  consented: boolean | null
  questionIndex: number
  answerIndex: number | null
  answerDraft: string
  answers: SurveyQuestionAnswer[]
  hasAnsweredAll: boolean
  finished: boolean
}

type Action<T extends keyof SurveyState = keyof SurveyState> =
  | {
      type: T
      value: SurveyState[T]
    }
  | {
      type: 'select_answer'
      value: number
    }
  | {
      type: 'continue'
    }
  | {
      type: 'skip'
    }

const initialState: SurveyState = {
  survey: undefined,
  agree: null,
  consented: false,
  questionIndex: 0,
  answerIndex: null,
  answerDraft: '',
  answers: [],
  hasAnsweredAll: false,
  finished: false,
}

function reducer(state: SurveyState, action: Action): SurveyState {
  switch (action.type) {
    case 'continue': {
      if (!state.survey) {
        return state
      }

      if (!state.consented && state.agree !== null) {
        return {
          ...state,
          consented: state.agree,
          hasAnsweredAll: !state.agree,
        }
      }

      if (state.hasAnsweredAll) {
        return {
          ...state,
          finished: true,
        }
      }

      const currentQuestion = state.survey.questions[state.questionIndex]

      const answerId = state.answerIndex !== null ? state.answerIndex : ''

      const answer: SurveyQuestionAnswer = {
        questionId: currentQuestion.id,
        question: currentQuestion.question,
        answerID: `${answerId}`,
        answer: state.answerDraft,
        response: currentQuestion.response,
        isMultiple: currentQuestion.is_multiple,
      }

      const answers = [...state.answers, answer]

      const nextQuestionIndex = getNextSurveyQuestionIndex(state)

      const wasLastQuestion = nextQuestionIndex >= state.survey.questions.length

      if (wasLastQuestion) {
        return {
          ...state,
          answerDraft: '',
          answerIndex: null,
          answers,
          hasAnsweredAll: true,
        }
      }

      return {
        ...state,
        questionIndex: nextQuestionIndex,
        answerDraft: '',
        answerIndex: null,
        answers,
      }
    }

    case 'skip': {
      const nextQuestionIndex = getNextSurveyQuestionIndex(state)

      return {
        ...state,
        questionIndex: nextQuestionIndex,
      }
    }

    default:
      return {
        ...state,
        [action.type]: action.value,
      }
  }
}

export type SurveyContext = {
  state: SurveyState
  dispatch: React.Dispatch<Action>
}

const defaultValue: SurveyContext = {
  state: initialState,
  dispatch: () => {
    //
  },
}

const SurveyContext = React.createContext<SurveyContext>(defaultValue)

export const SurveyProvider = ({
  survey,
  onFinish,
  children,
}: { survey?: Survey; onFinish: () => void } & React.PropsWithChildren) => {
  const [state, dispatch] = React.useReducer(reducer, {
    ...initialState,
    survey,
  })

  const currentUser = useSelector(currentUserSelector) as User // TODO:
  const reduxDispatch = useDispatch()

  React.useEffect(() => {
    if (!state.hasAnsweredAll || !state.survey) {
      return
    }

    const result = {
      id: state.survey.id,
      user_id: currentUser.id,
      isCompleted: true,
      isSurveyAnswered: true,
      questions: state.answers,
      utcDateTime: moment(),
    }

    reduxDispatch(answerSurvey(result))
  }, [state.hasAnsweredAll])

  React.useEffect(() => {
    if (!state.finished) {
      return
    }

    onFinish()
  }, [state.finished])

  return (
    <SurveyContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </SurveyContext.Provider>
  )
}

export const useSurvey = () => {
  return React.useContext(SurveyContext)
}

export const getSurveyQuestionOptions = (question: SurveyQuestion) => {
  // Convert [{ option1: string }, { option2:string }] to string[]
  return question.options.map((option) => (option ? Object.values(option)[0] : ''))
}

const getNextSurveyQuestionIndex = (state: SurveyState) => {
  if (!state.survey) {
    return 0
  }

  const currentQuestion = state.survey.questions[state.questionIndex]

  // Convert { option1: string, option2:string } to string[]
  const nextQuestions = Object.values(currentQuestion.next_question).map(
    (option) => Object.values(option)[0],
  )

  const currentAnswerIndex = state.answerIndex ?? 0
  const nextQuestion = nextQuestions[currentAnswerIndex]

  const nextQuestionIndex = nextQuestion
    ? parseInt(nextQuestion) - 1 // -1 because next_question numbers start at 1 not 0
    : state.questionIndex + 1 // default to next

  return nextQuestionIndex
}
