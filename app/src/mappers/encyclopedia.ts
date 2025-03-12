/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck TODO:
// import { EncyclopediaResponse, VideosResponse } from '../api/types'

import { EncyclopediaResponse, VideosResponse } from '../core/api'

export type Encyclopedia = ReturnType<typeof fromEncyclopedia>

export function fromEncyclopedia({
  encyclopediaResponse,
  videosResponse = [],
}: {
  encyclopediaResponse: EncyclopediaResponse
  videosResponse?: VideosResponse
}) {
  const dataShape = {
    categories: {
      byId: {},
      allIds: [],
    },
    subCategories: {
      byId: {},
      allIds: [],
    },
    articles: {
      byId: {},
      allIds: [],
    },
    videos: {
      byId: {},
      allIds: [],
    },
  }

  encyclopediaResponse.forEach((item) => {
    // main category
    const categoryAlreadyExists = dataShape.categories.byId[item.cat_id]
    if (!categoryAlreadyExists) {
      dataShape.categories = {
        byId: {
          ...dataShape.categories.byId,
          [item.cat_id]: {
            id: item.cat_id,
            name: item.category_title,
            tags: {
              primary: {
                name: item.primary_emoji_name,
                emoji: item.primary_emoji,
              },
            },
            subCategories: [],
          },
        },
        allIds: dataShape.categories.allIds.concat(item.cat_id),
      }
    }
    // Subcategory
    const subcategoryAlreadyExists = dataShape.subCategories.byId[item.subcat_id]
    if (!subcategoryAlreadyExists) {
      dataShape.subCategories = {
        byId: {
          ...dataShape.subCategories.byId,
          [item.subcat_id]: {
            id: item.subcat_id,
            name: item.subcategory_title,
            articles: [],
          },
        },
        allIds: dataShape.subCategories.allIds.concat(item.subcat_id),
      }
      // add relevant subCategory to category list
      dataShape.categories.byId[item.cat_id] = {
        ...dataShape.categories.byId[item.cat_id],
        subCategories: dataShape.categories.byId[item.cat_id].subCategories.concat(item.subcat_id),
      }
    }
    // // articles

    dataShape.articles = {
      byId: {
        ...dataShape.articles.byId,
        [item.id]: {
          id: item.id,
          title: item.article_heading,
          content: item.article_text,
          category: item.category_title,
          subCategory: item.subcategory_title,
          ageRestrictionLevel: item.ageRestrictionLevel,
          contentFilter: item.contentFilter,
          voiceOverKey: item.voiceOverKey,
        },
      },
      allIds: dataShape.articles.allIds.concat(item.id),
    }
    // add relevant article to subcategory list
    dataShape.subCategories.byId[item.subcat_id] = {
      ...dataShape.subCategories.byId[item.subcat_id],
      articles: dataShape.subCategories.byId[item.subcat_id].articles.concat(item.id),
    }
  })

  // === VIDEOS === //
  videosResponse.forEach((item) => {
    dataShape.videos = {
      byId: {
        ...dataShape.videos.byId,
        [item.id]: {
          id: item.id,
          title: item.title,
          youtubeId: item.youtubeId,
          assetName: item.assetName,
          live: item.live,
        },
      },
      allIds: dataShape.videos.allIds.concat(item.id),
    }
  })

  return {
    categories: dataShape.categories,
    subCategories: dataShape.subCategories,
    articles: dataShape.articles,
    videos: dataShape.videos,
  }
}
