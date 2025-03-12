import React from 'react'
import { useSearch } from '../../hooks/useSearch'
import { useSelector } from '../../redux/useSelector'
import {
  allArticlesSelector,
  allCategoriesSelector,
  allSubCategoriesSelector,
  allVideosSelector,
  currentLocaleSelector,
  currentUserSelector,
} from '../../redux/selectors'
import { Article, Category, SubCategory, VideoData } from '../../core/types'
import { canAccessContent } from '../../services/restriction'

export type EncyclopediaContext = {
  query: string
  setQuery: React.Dispatch<React.SetStateAction<string>>
  categoryIds: string[]
  subcategoryIds: string[]
  articleIds: string[]
  selectedCategoryIds: string[]
  setSelectedCategoryIds: React.Dispatch<React.SetStateAction<string[]>>
  filteredCategoryIds: string[]
  videos: VideoData[]
  selectedVideoId: string | undefined
  setSelectedVideoId: React.Dispatch<React.SetStateAction<string | undefined>>
}

interface ArticleWithParentIds extends Article {
  categoryId: string
  subCategoryId: string
}

const defaultValue: EncyclopediaContext = {
  query: '',
  setQuery: () => {},
  categoryIds: [],
  subcategoryIds: [],
  articleIds: [],
  selectedCategoryIds: [],
  setSelectedCategoryIds: () => {},
  filteredCategoryIds: [],
  videos: [],
  selectedVideoId: undefined,
  setSelectedVideoId: () => {},
}

const EncyclopediaContext = React.createContext<EncyclopediaContext>(defaultValue)

export const EncyclopediaProvider = ({ children }: React.PropsWithChildren) => {
  const currentUser = useSelector(currentUserSelector)
  const categories = useSelector(allCategoriesSelector)
  const subCategories = useSelector(allSubCategoriesSelector)
  const articles = useSelector(allArticlesSelector)
  const allVideos = useSelector(allVideosSelector)
  const locale = useSelector(currentLocaleSelector)

  const liveArticles: Article[] = React.useMemo(() => {
    return articles.filter((item) => item?.live !== false)
  }, [articles])

  const articlesWithParentIds: ArticleWithParentIds[] = React.useMemo(() => {
    return getArticlesWithParentIds(liveArticles, categories, subCategories)
  }, [liveArticles, categories, subCategories])

  const moderatedArticles: ArticleWithParentIds[] = React.useMemo(() => {
    return articlesWithParentIds.filter((item) => canAccessContent(item, currentUser))
  }, [
    liveArticles,
    categories,
    subCategories,
    currentUser,
    currentUser?.metadata?.contentSelection,
  ])

  const { query, setQuery, results } = useSearch<ArticleWithParentIds>({
    options: moderatedArticles,
    keys: searchKeys,
  })

  const { results: videos } = useSearch<VideoData>({
    externalQuery: query,
    options: allVideos,
    keys: videoSearchKeys,
  })

  const { categoryIds, subcategoryIds, articleIds } = React.useMemo(() => {
    return getFilteredIds(results)
  }, [results])

  const [selectedCategoryIds, setSelectedCategoryIds] = React.useState<string[]>([])

  const [selectedVideoId, setSelectedVideoId] = React.useState<string>()

  const filteredCategoryIds =
    selectedCategoryIds.length === 0
      ? categoryIds
      : categoryIds.filter((item) => selectedCategoryIds.includes(item))

  React.useEffect(() => {
    setQuery('')
    setSelectedCategoryIds([])
    setSelectedVideoId(undefined)
  }, [locale])

  return (
    <EncyclopediaContext.Provider
      value={{
        query,
        setQuery,
        selectedCategoryIds,
        setSelectedCategoryIds,
        filteredCategoryIds,
        categoryIds,
        subcategoryIds,
        articleIds,
        videos,
        selectedVideoId,
        setSelectedVideoId,
      }}
    >
      {children}
    </EncyclopediaContext.Provider>
  )
}

export const useEncyclopedia = () => {
  return React.useContext(EncyclopediaContext)
}

const searchKeys = [
  'title' as const,
  'content' as const,
  'category' as const,
  'subCategory' as const,
]

const videoSearchKeys = [
  'title' as const, //
  'assetName' as const,
]

const getArticlesWithParentIds = (
  articles: Article[],
  categories: Category[],
  subCategories: SubCategory[],
) => {
  return articles.reduce<ArticleWithParentIds[]>((acc, article) => {
    const subCategory = subCategories.find((sub) => sub.articles.includes(article.id))

    if (!subCategory) {
      return acc
    }

    const category = categories.find((cat) => cat.subCategories.includes(subCategory.id))

    if (!category) {
      return acc
    }

    const articleWithParentIds = {
      ...article,
      categoryId: category.id,
      subCategoryId: subCategory.id,
    }

    return [...acc, articleWithParentIds]
  }, [])
}

const getFilteredIds = (filteredArticles: ArticleWithParentIds[]) => {
  const articleIds = filteredArticles.map((article) => article.id)
  const categoryIds = Array.from(new Set(filteredArticles.map((article) => article.categoryId)))
  const subcategoryIds = Array.from(
    new Set(filteredArticles.map((article) => article.subCategoryId)),
  )

  return { categoryIds, subcategoryIds, articleIds }
}
