import Fuse from 'fuse.js'

export const handleFuseSearchResult = (
  searchStr,
  categories,
  subCategories,
  articles,
  locale,
  setFilteredSubCategories,
) => {
  if (searchStr === '') return []
  const lowerCaseSearchStr = searchStr.toLocaleLowerCase(locale)
  const options = {
    keys: ['name'], // Adjust this to include more search fields as needed
    threshold: 0.3, // You can adjust the threshold to control the fuzziness of the search
  }
  const joinedData = [...categories, ...subCategories]
  // Initialize a new Fuse instance
  const fuse = new Fuse(joinedData, options)

  // Perform the fuzzy search
  const searchResults = fuse.search(lowerCaseSearchStr)
  // Extract the original items from the search results
  // console.log('result search', JSON.stringify(searchResults))
  const searchFuseResult = searchResults.map((result) => result.item)

  setFilteredSubCategories(searchFuseResult)
  const searchResultCategories = categories.filter((category) => {
    const doesSubCategoryOrArticlesContainString = category.subCategories.some((subCatId) => {
      return searchFuseResult.find((item) => {
        return item.id === subCatId
      })
    })

    const isCategoryContainString = searchFuseResult.find((item) => {
      return item.name === category.name
    })
    return isCategoryContainString || doesSubCategoryOrArticlesContainString
  })
  return searchResultCategories || []
}

export function handleCategoriesFilter(
  categories,
  mood,
  searchStr,
  subCategories,
  articles,
  locale,
  setFilteredSubCategories,
) {
  return mood.length
    ? categories.filter((category) => {
        return mood.indexOf(category.tags.primary.emoji) !== -1
      })
    : handleFuseSearchResult(
        searchStr,
        categories,
        subCategories,
        articles,
        locale,
        setFilteredSubCategories,
      )
}
