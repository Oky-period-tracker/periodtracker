import { EncyclopediaResponse } from '../api/types'

export type Encyclopedia = ReturnType<typeof fromEncyclopedia>

export function fromEncyclopedia(response: EncyclopediaResponse) {
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
  }
  let previousCat = ''
  let previousSubCat = ''
  response.forEach(item => {
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

  return {
    categories: dataShape.categories,
    subCategories: dataShape.subCategories,
    articles: dataShape.articles,
  }
}
