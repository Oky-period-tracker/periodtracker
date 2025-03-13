import { QuizzesResponse } from '../../../src/core/api'
import { fromQuizzes } from '../../../src/mappers'

describe('fromQuizzes', () => {
  const mockQuizzesResponse: QuizzesResponse = [
    {
      id: 'quiz1',
      isAgeRestricted: false,
      question: 'What is the capital of France?',
      option1: 'Paris',
      option2: 'London',
      option3: 'Berlin',
      right_answer: '1',
      right_answer_response: 'Correct! Paris is the capital.',
      wrong_answer_response: 'Incorrect. The capital is Paris.',
      lang: 'en',
      live: true,
    },
    {
      id: 'quiz2',
      isAgeRestricted: true,
      question: 'What is 2 + 2?',
      option1: '3',
      option2: '4',
      option3: '5',
      right_answer: '2',
      right_answer_response: 'Correct! 2 + 2 is 4.',
      wrong_answer_response: 'Incorrect. The correct answer is 4.',
      lang: 'en',
      live: true,
    },
  ]

  it('should transform QuizzesResponse into Quizzes format', () => {
    const { quizzes } = fromQuizzes(mockQuizzesResponse)

    const expectedQuizzes = {
      byId: {
        quiz1: {
          id: 'quiz1',
          isAgeRestricted: false,
          question: 'What is the capital of France?',
          answers: [
            { text: 'Paris', emoji: '', isCorrect: true },
            { text: 'London', emoji: '', isCorrect: false },
            { text: 'Berlin', emoji: '', isCorrect: false },
          ],
          response: {
            correct: 'Correct! Paris is the capital.',
            in_correct: 'Incorrect. The capital is Paris.',
          },
        },
        quiz2: {
          id: 'quiz2',
          isAgeRestricted: true,
          question: 'What is 2 + 2?',
          answers: [
            { text: '3', emoji: '', isCorrect: false },
            { text: '4', emoji: '', isCorrect: true },
            { text: '5', emoji: '', isCorrect: false },
          ],
          response: {
            correct: 'Correct! 2 + 2 is 4.',
            in_correct: 'Incorrect. The correct answer is 4.',
          },
        },
      },
      allIds: ['quiz1', 'quiz2'],
    }

    expect(quizzes).toEqual(expectedQuizzes)
  })

  it('should handle an empty response', () => {
    const { quizzes } = fromQuizzes([])

    const expectedQuizzes = {
      byId: {},
      allIds: [],
    }

    expect(quizzes).toEqual(expectedQuizzes)
  })
})
