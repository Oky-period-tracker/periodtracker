import { SurveysResponse } from '../api/types'

export interface Surveys {
  byId: {
    [id: string]: {
      id: string
      question: string
      answers: Array<{
        text: string
        emoji: string
      }>
    }
  }
  allIds: string[]
}

export type Survey = ReturnType<typeof fromSurveys>

export function fromSurveys(response: SurveysResponse) {
  const surveys = response.reduce<Surveys>(
    (data, survey) => {
      return {
        byId: {
          ...data.byId,
          [survey.id]: {
            id: survey.id,
            question: survey.question,
            response: survey.response,
            answers: [
              { text: survey.option1, emoji: '' },
              { text: survey.option2, emoji: '' },
              { text: survey.option3, emoji: '' },
              { text: survey.option4, emoji: '' },
              { text: survey.option5, emoji: '' },
            ],
          },
        },
        allIds: data.allIds.concat(survey.id),
      }
    },
    { byId: {}, allIds: [] },
  )
  return { surveys }
}
