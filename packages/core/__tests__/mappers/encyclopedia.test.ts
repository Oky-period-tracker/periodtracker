import { fromEncyclopedia } from '../../src/mappers/encyclopedia'
import { EncyclopediaResponse, VideosResponse, EncyclopediaResponseItem } from '../../src/api/types'

describe('fromEncyclopedia', () => {
  it('should properly normalize an empty encyclopedia response', () => {
    const result = fromEncyclopedia({ encyclopediaResponse: [] })
    expect(result).toEqual({
      categories: { byId: {}, allIds: [] },
      subCategories: { byId: {}, allIds: [] },
      articles: { byId: {}, allIds: [] },
      videos: { byId: {}, allIds: [] },
    })
  })

  it('should normalize a response with one category', () => {
    const mockResponse: EncyclopediaResponse = [
      {
        id: '1-1-1',
        cat_id: '1',
        category_title: 'Science',
        subcategory_title: 'Physics',
        subcat_id: '1-1',
        article_heading: 'Quantum Mechanics',
        article_text: 'Quantum mechanics describes...',
        primary_emoji: '⚛️',
        primary_emoji_name: 'Atom',
        lang: 'string',
        live: true,
      },
    ]

    const result = fromEncyclopedia({ encyclopediaResponse: mockResponse })

    expect(result.categories.byId['1']).toEqual({
      id: '1',
      name: 'Science',
      tags: {
        primary: {
          name: 'Atom',
          emoji: '⚛️',
        },
      },
      subCategories: ['1-1'],
    })
    expect(result.subCategories.byId['1-1']).toEqual({
      id: '1-1',
      name: 'Physics',
      articles: ['1-1-1'],
    })
    expect(result.articles.byId['1-1-1']).toEqual({
      id: '1-1-1',
      title: 'Quantum Mechanics',
      content: 'Quantum mechanics describes...',
      category: 'Science',
      subCategory: 'Physics',
    })
  })

  it('should normalize a response with multiple categories', () => {
    const mockResponse: EncyclopediaResponse = [
      {
        id: '1-1-1',
        cat_id: '1',
        category_title: 'Science',
        subcategory_title: 'Physics',
        subcat_id: '1-1',
        article_heading: 'Quantum Mechanics',
        article_text: 'Quantum mechanics describes...',
        primary_emoji: '⚛️',
        primary_emoji_name: 'Atom',
        lang: 'string',
        live: true,
      },
      {
        id: '2-1-1',
        cat_id: '2',
        category_title: 'Maths',
        subcategory_title: 'Calculus',
        subcat_id: '1-1',
        article_heading: 'Calculus',
        article_text: 'Calculus describes...',
        primary_emoji: '⚛️',
        primary_emoji_name: 'Atom',
        lang: 'string',
        live: true,
      },
    ]

    const result = fromEncyclopedia({ encyclopediaResponse: mockResponse })

    expect(Object.keys(result.categories.byId)).toHaveLength(2)
    expect(result.categories.allIds).toContain('1')
    expect(result.categories.allIds).toContain('2')
    expect(result.categories.byId['1'].name).toBe('Science')
    expect(result.categories.byId['2'].name).toBe('Maths')
  })

  it('should handle videos when provided', () => {
    const mockEncyclopediaResponse: EncyclopediaResponse = [
      // ... Existing mock data for encyclopedia entries
    ]

    const mockVideosResponse: VideosResponse = [
      {
        id: '1',
        title: 'Introduction to Quantum Mechanics',
        youtubeId: 'quantum123',
        assetName: 'quantum_video',
        live: false,
        parent_category: '1',
      },
    ]

    const result = fromEncyclopedia({
      encyclopediaResponse: mockEncyclopediaResponse,
      videosResponse: mockVideosResponse,
    })

    expect(result.videos.byId['1']).toEqual({
      id: '1',
      title: 'Introduction to Quantum Mechanics',
      youtubeId: 'quantum123',
      assetName: 'quantum_video',
      live: false,
    })
  })

  it('should handle missing data fields', () => {
    const mockResponseWithMissingFields: Array<Partial<EncyclopediaResponseItem>> = [
      {
        cat_id: '1',
        category_title: undefined,
      },
    ]

    // @ts-ignore
    const result = fromEncyclopedia({ encyclopediaResponse: mockResponseWithMissingFields })
    expect(result.categories.byId['1']).toHaveProperty('name', undefined)
  })

  it('should be a pure function', () => {
    const mockResponse: EncyclopediaResponse = [
      {
        id: '1-1-1',
        cat_id: '1',
        category_title: 'Science',
        subcategory_title: 'Physics',
        subcat_id: '1-1',
        article_heading: 'Quantum Mechanics',
        article_text: 'Quantum mechanics describes...',
        primary_emoji: '⚛️',
        primary_emoji_name: 'Atom',
        lang: 'string',
        live: true,
      },
    ]

    const originalResponse = JSON.parse(JSON.stringify(mockResponse)) // Deep copy to ensure purity
    fromEncyclopedia({ encyclopediaResponse: mockResponse })

    expect(mockResponse).toEqual(originalResponse) // The input should remain unchanged after the function call
  })

  //   // TODO: The mapper uses the cat title not cat id
  //   it('should handle categories with the same name but different IDs', () => {
  //     const mockResponse: EncyclopediaResponse = [
  //       // @ts-ignore
  //       {
  //         cat_id: '1',
  //         category_title: 'Science',
  //       },
  //       // @ts-ignore
  //       {
  //         cat_id: '2',
  //         category_title: 'Science',
  //       },
  //     ]

  //     const result = fromEncyclopedia({ encyclopediaResponse: mockResponse })
  //     expect(result.categories.byId['1']).not.toEqual(result.categories.byId['2'])
  //     expect(result.categories.allIds).toContain('1')
  //     expect(result.categories.allIds).toContain('2')
  //   })
})
