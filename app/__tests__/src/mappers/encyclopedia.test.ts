import { EncyclopediaResponse, VideosResponse } from '../../../src/core/api'
import { fromEncyclopedia } from '../../../src/mappers'

describe('fromEncyclopedia', () => {
  const mockEncyclopediaResponse: EncyclopediaResponse = [
    {
      id: 'article1',
      cat_id: 'category1',
      subcat_id: 'subcategory1',
      category_title: 'Health',
      subcategory_title: 'Fitness',
      article_heading: 'How to stay fit',
      article_text: 'Exercise regularly and eat healthy.',
      primary_emoji_name: 'smile',
      primary_emoji: '😊',
      lang: 'en',
      live: true,
    },
    {
      id: 'article2',
      cat_id: 'category1',
      subcat_id: 'subcategory2',
      category_title: 'Health',
      subcategory_title: 'Diet',
      article_heading: 'Healthy Eating',
      article_text: 'Eat more fruits and vegetables.',
      primary_emoji_name: 'apple',
      primary_emoji: '🍎',
      lang: 'en',
      live: true,
    },
  ]

  const mockVideosResponse: VideosResponse = [
    {
      id: 'video1',
      title: 'Fitness Tips',
      youtubeId: 'abc123',
      assetName: 'fitness_tips',
      live: false,
    },
    {
      id: 'video2',
      title: 'Healthy Recipes',
      youtubeId: 'def456',
      assetName: 'healthy_recipes',
      live: true,
    },
  ]

  it('transforms encyclopedia and video responses correctly', () => {
    const result = fromEncyclopedia({
      encyclopediaResponse: mockEncyclopediaResponse,
      videosResponse: mockVideosResponse,
    })

    expect(result).toEqual({
      categories: {
        byId: {
          category1: {
            id: 'category1',
            name: 'Health',
            tags: {
              primary: {
                name: 'smile',
                emoji: '😊',
              },
            },
            subCategories: ['subcategory1', 'subcategory2'],
          },
        },
        allIds: ['category1'],
      },
      subCategories: {
        byId: {
          subcategory1: {
            id: 'subcategory1',
            name: 'Fitness',
            articles: ['article1'],
          },
          subcategory2: {
            id: 'subcategory2',
            name: 'Diet',
            articles: ['article2'],
          },
        },
        allIds: ['subcategory1', 'subcategory2'],
      },
      articles: {
        byId: {
          article1: {
            id: 'article1',
            title: 'How to stay fit',
            content: 'Exercise regularly and eat healthy.',
            category: 'Health',
            subCategory: 'Fitness',
          },
          article2: {
            id: 'article2',
            title: 'Healthy Eating',
            content: 'Eat more fruits and vegetables.',
            category: 'Health',
            subCategory: 'Diet',
          },
        },
        allIds: ['article1', 'article2'],
      },
      videos: {
        byId: {
          video1: {
            id: 'video1',
            title: 'Fitness Tips',
            youtubeId: 'abc123',
            assetName: 'fitness_tips',
            live: false,
          },
          video2: {
            id: 'video2',
            title: 'Healthy Recipes',
            youtubeId: 'def456',
            assetName: 'healthy_recipes',
            live: true,
          },
        },
        allIds: ['video1', 'video2'],
      },
    })
  })

  it('handles an empty encyclopedia response', () => {
    const result = fromEncyclopedia({
      encyclopediaResponse: [],
      videosResponse: mockVideosResponse,
    })

    expect(result.categories).toEqual({ byId: {}, allIds: [] })
    expect(result.subCategories).toEqual({ byId: {}, allIds: [] })
    expect(result.articles).toEqual({ byId: {}, allIds: [] })
    expect(result.videos).toEqual({
      byId: {
        video1: {
          id: 'video1',
          title: 'Fitness Tips',
          youtubeId: 'abc123',
          assetName: 'fitness_tips',
          live: false,
        },
        video2: {
          id: 'video2',
          title: 'Healthy Recipes',
          youtubeId: 'def456',
          assetName: 'healthy_recipes',
          live: true,
        },
      },
      allIds: ['video1', 'video2'],
    })
  })

  it('handles an empty videos response', () => {
    const result = fromEncyclopedia({
      encyclopediaResponse: mockEncyclopediaResponse,
      videosResponse: [],
    })

    expect(result.videos).toEqual({ byId: {}, allIds: [] })
    expect(result.categories.allIds).toEqual(['category1'])
    expect(result.subCategories.allIds).toEqual(['subcategory1', 'subcategory2'])
    expect(result.articles.allIds).toEqual(['article1', 'article2'])
  })
})
