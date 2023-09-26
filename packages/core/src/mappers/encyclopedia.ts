import { EncyclopediaResponse, VideosResponse } from '../api/types'

export type Encyclopedia = ReturnType<typeof fromEncyclopedia>

export function fromEncyclopedia({
  encyclopediaResponse,
  videosResponse,
}: {
  encyclopediaResponse: EncyclopediaResponse
  videosResponse: VideosResponse
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
  let previousCat = ''
  let previousSubCat = ''
  encyclopediaResponse.forEach((item) => {
    // main category
    if (item.category_title !== previousCat) {
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
            videos: [],
          },
        },
        allIds: dataShape.categories.allIds.concat(item.cat_id),
      }
    }
    // Subcategory
    if (item.subcategory_title !== previousSubCat) {
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
        },
      },
      allIds: dataShape.articles.allIds.concat(item.id),
    }
    // add relevant article to subcategory list
    dataShape.subCategories.byId[item.subcat_id] = {
      ...dataShape.subCategories.byId[item.subcat_id],
      articles: dataShape.subCategories.byId[item.subcat_id].articles.concat(item.id),
    }

    previousCat = item.category_title
    previousSubCat = item.subcategory_title
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

    dataShape.categories.byId[item.parent_category] = {
      ...dataShape.categories.byId[item.parent_category],
      videos: dataShape.categories.byId[item.parent_category].videos.concat(item.id),
    }
  })

  return {
    categories: dataShape.categories,
    subCategories: dataShape.subCategories,
    articles: dataShape.articles,
    videos: dataShape.videos,
  }
}
