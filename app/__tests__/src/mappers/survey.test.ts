import { SurveysResponse } from '../../../src/core/api'
import { fromSurveys } from '../../../src/mappers'

describe('fromSurveys', () => {
  const mockSurveysResponse: SurveysResponse = [
    {
      id: '1',
      question: 'What is your favorite color?',
      option1: 'Red',
      option2: 'Blue',
      option3: 'Green',
      option4: 'Yellow',
      option5: 'Purple',
      response: 'response',
      lang: 'en',
    },
    {
      id: '2',
      question: 'What is your favorite animal?',
      option1: 'Dog',
      option2: 'Cat',
      option3: 'Bird',
      option4: 'Fish',
      option5: 'Rabbit',
      response: 'response',
      lang: 'en',
    },
  ]

  it('should transform SurveysResponse into Surveys format', () => {
    const { surveys } = fromSurveys(mockSurveysResponse)

    const expectedSurveys = {
      byId: {
        '1': {
          id: '1',
          question: 'What is your favorite color?',
          response: 'response',
          answers: [
            { text: 'Red', emoji: '' },
            { text: 'Blue', emoji: '' },
            { text: 'Green', emoji: '' },
            { text: 'Yellow', emoji: '' },
            { text: 'Purple', emoji: '' },
          ],
        },
        '2': {
          id: '2',
          question: 'What is your favorite animal?',
          response: 'response',
          answers: [
            { text: 'Dog', emoji: '' },
            { text: 'Cat', emoji: '' },
            { text: 'Bird', emoji: '' },
            { text: 'Fish', emoji: '' },
            { text: 'Rabbit', emoji: '' },
          ],
        },
      },
      allIds: ['1', '2'],
    }

    expect(surveys).toEqual(expectedSurveys)
  })

  it('should handle an empty response', () => {
    const { surveys } = fromSurveys([])

    const expectedSurveys = {
      byId: {},
      allIds: [],
    }

    expect(surveys).toEqual(expectedSurveys)
  })
})
