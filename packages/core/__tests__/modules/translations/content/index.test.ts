import { content } from '../../../../../../app/src/resources/translations/content'

describe('Static Content Integrity', () => {
  let locales: string[] = []
  beforeEach(() => {
    locales = Object.keys(content)
  })

  it('should not have duplicate ids across all languages', () => {
    const allIds = new Set<string>()

    for (const locale of locales) {
      const {
        articles,
        categories,
        subCategories,
        quizzes,
        didYouKnows,
        helpCenters,
        videos,
      } = content[locale]

      // Check Articles
      articles.allIds.forEach((id) => {
        expect(allIds.has(id)).toBeFalsy()
        allIds.add(id)
      })

      // Check Categories
      categories.allIds.forEach((id) => {
        expect(allIds.has(id)).toBeFalsy()
        allIds.add(id)
      })

      // Check SubCategories
      subCategories.allIds.forEach((id) => {
        expect(allIds.has(id)).toBeFalsy()
        allIds.add(id)
      })

      // Check Quizzes
      quizzes.allIds.forEach((id) => {
        expect(allIds.has(id)).toBeFalsy()
        allIds.add(id)
      })

      // Check DidYouKnows
      didYouKnows.allIds.forEach((id) => {
        expect(allIds.has(id)).toBeFalsy()
        allIds.add(id)
      })

      // Check Videos if they exist
      videos?.allIds.forEach((id) => {
        expect(allIds.has(id)).toBeFalsy()
        allIds.add(id)
      })
    }
  })

  it('should reference existing subcategories in each category', () => {
    for (const locale of locales) {
      const { categories, subCategories } = content[locale]

      categories.allIds.forEach((categoryId) => {
        const category = categories.byId[categoryId]
        category.subCategories.forEach((subCategoryId) => {
          const subCategoryIdExists = subCategories.allIds.includes(subCategoryId)
          const subCategoryExists = !!subCategories.byId[subCategoryId]
          expect(subCategoryIdExists).toBeTruthy()
          expect(subCategoryExists).toBeTruthy()
        })
      })
    }
  })

  it('should reference existing articles in each subcategory', () => {
    for (const locale of locales) {
      const { subCategories, articles } = content[locale]

      subCategories.allIds.forEach((subCategoryId) => {
        const subCategory = subCategories.byId[subCategoryId]
        subCategory.articles.forEach((articleId) => {
          const articleIdExists = articles.allIds.includes(articleId)
          const articleExists = !!articles.byId[articleId]
          expect(articleIdExists).toBeTruthy()
          expect(articleExists).toBeTruthy()
        })
      })
    }
  })
})
