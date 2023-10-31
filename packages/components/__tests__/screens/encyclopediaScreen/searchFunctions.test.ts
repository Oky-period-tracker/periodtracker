import { handleSearchResult } from '../../../src/screens/encyclopediaScreen/searchFunctions'

// @ts-ignore
import { defaultLocale, liveContent } from '@oky/core'

const content = liveContent[defaultLocale]
const articles = content.articles.allIds.map((id) => content.articles.byId[id])
const categories = content.categories.allIds.map((id) => content.categories.byId[id])
const subCategories = content.subCategories.allIds.map((id) => content.subCategories.byId[id])

const existingCategory = categories[0]
const existingSubCategory = content.subCategories.byId[existingCategory.subCategories[0]]
const existingArticle = content.articles.byId[existingSubCategory.articles[0]]

describe('handleSearchResult', () => {
  const locale = defaultLocale

  it('should return empty array if search string is empty', () => {
    expect(handleSearchResult('', categories, subCategories, articles, locale)).toEqual([])
  })

  it('should return categories that match the search string', () => {
    const searchResult = handleSearchResult(
      existingCategory.name,
      categories,
      subCategories,
      articles,
      locale,
    )
    expect(searchResult).toEqual([existingCategory])
  })

  it('should return categories whose subcategories match the search string', () => {
    const searchResult = handleSearchResult(
      existingSubCategory.name,
      categories,
      subCategories,
      articles,
      locale,
    )
    expect(searchResult).toContainEqual(existingCategory)
  })

  it('should return categories whose articles match the search string', () => {
    const searchResult = handleSearchResult(
      existingArticle.title,
      categories,
      subCategories,
      articles,
      locale,
    )
    expect(searchResult).toContainEqual(existingCategory)
  })

  it('should return an empty array if no matches are found', () => {
    const searchResult = handleSearchResult(
      'Nonexistent',
      categories,
      subCategories,
      articles,
      locale,
    )
    expect(searchResult).toEqual([])
  })
})
