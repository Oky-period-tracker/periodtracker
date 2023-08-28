import { DidYouKnowsResponse } from '../api/types'
import { v4 as uuidv4 } from 'uuid'

export interface DidYouKnows {
  byId: {
    [id: string]: {
      id: string
      title: string
      content: string
    }
  }
  allIds: string[]
}

export type DidYouKnow = ReturnType<typeof fromDidYouKnows>

export function fromDidYouKnows(response: DidYouKnowsResponse) {
  const didYouKnows = response.reduce<DidYouKnows>(
    (data, didyouknow) => {
      const id = uuidv4()
      return {
        byId: {
          ...data.byId,
          [id]: {
            id,
            isAgeRestricted: didyouknow.isAgeRestricted,
            title: didyouknow.title,
            content: didyouknow.content,
          },
        },
        allIds: data.allIds.concat(id),
      }
    },
    { byId: {}, allIds: [] },
  )
  return { didYouKnows }
}
