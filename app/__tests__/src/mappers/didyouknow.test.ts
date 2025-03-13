import { DidYouKnowsResponse } from '../../../src/core/api'
import { fromDidYouKnows } from '../../../src/mappers'

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mocked-uuid'),
}))

describe('fromDidYouKnows', () => {
  const mockResponse: DidYouKnowsResponse = [
    {
      id: 'mocked-uuid',
      isAgeRestricted: true,
      title: 'Fact 1',
      content: 'This is an interesting fact about something.',
      lang: 'en',
      live: true,
    },
  ]

  it('transforms the DidYouKnows response correctly', () => {
    const result = fromDidYouKnows(mockResponse)

    expect(result).toEqual({
      didYouKnows: {
        byId: {
          'mocked-uuid': {
            id: 'mocked-uuid',
            isAgeRestricted: true,
            title: 'Fact 1',
            content: 'This is an interesting fact about something.',
          },
        },
        allIds: ['mocked-uuid'], // Mocked UUID will be repeated since we're mocking uuidv4 with a static return
      },
    })
  })

  it('handles an empty response', () => {
    const result = fromDidYouKnows([])

    expect(result).toEqual({
      didYouKnows: {
        byId: {},
        allIds: [],
      },
    })
  })
})
