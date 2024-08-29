// import { QuizzesResponse } from '../api/types'

import { QuizzesResponse } from '../core/api'

export interface Quizzes {
  byId: {
    [id: string]: {
      id: string
      question: string
      answers: Array<{
        text: string
        emoji: string
        isCorrect: boolean
      }>
      response: {
        correct: string
        in_correct: string
      }
    }
  }
  allIds: string[]
}

// TODO_ALEX: FIXME conflict with components type Quiz
export type Quiz = ReturnType<typeof fromQuizzes>

export function fromQuizzes(response: QuizzesResponse) {
  const quizzes = response.reduce<Quizzes>(
    (data, quiz) => ({
      byId: {
        ...data.byId,
        [quiz.id]: {
          id: quiz.id,
          isAgeRestricted: quiz.isAgeRestricted,
          question: quiz.question,
          answers: [
            {
              text: quiz.option1,
              emoji: '',
              isCorrect: quiz.right_answer === '1',
            },
            {
              text: quiz.option2,
              emoji: '',
              isCorrect: quiz.right_answer === '2',
            },
            {
              text: quiz.option3,
              emoji: '',
              isCorrect: quiz.right_answer === '3',
            },
          ],
          response: {
            correct: quiz.right_answer_response,
            in_correct: quiz.wrong_answer_response,
          },
        },
      },
      allIds: data.allIds.concat(quiz.id),
    }),
    { byId: {}, allIds: [] },
  )
  return { quizzes }
}
