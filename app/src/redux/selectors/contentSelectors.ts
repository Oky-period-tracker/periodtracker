import _ from 'lodash'
import { ReduxState } from '../reducers'
import { isDefined } from '../../services/utils'

const s = (state: ReduxState) => state.content
const EMPTY_ARRAY: [] = []

const createIdsByIdSelector = <T>() => {
  let lastIds: string[] | undefined
  let lastById: Record<string, T | undefined> | undefined
  let lastResult: T[] = EMPTY_ARRAY

  return (ids?: string[], byId?: Record<string, T | undefined>) => {
    if (!ids || !byId) return EMPTY_ARRAY
    if (ids === lastIds && byId === lastById) return lastResult

    lastIds = ids
    lastById = byId
    lastResult = ids.map((id) => byId[id]).filter(isDefined)
    return lastResult
  }
}

const selectAllArticles = createIdsByIdSelector<NonNullable<ReduxState['content']['articles']['byId'][string]>>()
const selectAllVideos = createIdsByIdSelector<NonNullable<ReduxState['content']['videos']['byId'][string]>>()
const selectAllCategories = createIdsByIdSelector<
  NonNullable<ReduxState['content']['categories']['byId'][string]>
>()
const selectAllSubCategories = createIdsByIdSelector<
  NonNullable<ReduxState['content']['subCategories']['byId'][string]>
>()

export const articlesSelector = (state: ReduxState) => s(state).articles

export const allArticlesSelector = (state: ReduxState) => {
  const articles = s(state)?.articles
  return selectAllArticles(articles?.allIds, articles?.byId)
}

export const allVideosSelector = (state: ReduxState) => {
  const videos = s(state)?.videos
  return selectAllVideos(videos?.allIds, videos?.byId)
}

export const articleByIDSelector = (state: ReduxState, id: string) => {
  const articles = s(state).articles
  return articles.byId?.[id]
}

export const videoByIDSelector = (state: ReduxState, id: string) => {
  return s(state)?.videos?.byId?.[id]
}

export const articlesObjectByIDSelector = (state: ReduxState) => {
  return s(state).articles?.byId ?? {}
}

export const allHelpCentersForCurrentLocale = (state: ReduxState) => {
  return s(state).helpCenters.filter((item) => item.lang === state.app?.locale)
}

export const helpCenterAttributesSelector = (state: ReduxState) => {
  return s(state).helpCenterAttributes
}

export const allCategoriesSelector = (state: ReduxState) => {
  const categories = s(state)?.categories
  return selectAllCategories(categories?.allIds, categories?.byId)
}

export const allSubCategoriesSelector = (state: ReduxState) => {
  const subCategories = s(state)?.subCategories
  return selectAllSubCategories(subCategories?.allIds, subCategories?.byId)
}

export const allSubCategoriesByIdSelector = (state: ReduxState) => {
  return s(state)?.subCategories?.byId ?? {}
}

export const categoryByIDSelector = (state: ReduxState, id: string) => {
  return s(state)?.categories?.byId?.[id]
}

export const subCategoryByIDSelector = (state: ReduxState, id: string) => {
  return s(state)?.subCategories?.byId?.[id]
}

export const allAvatarText = (state: ReduxState) => {
  return s(state)?.avatarMessages
}

export const privacyContent = (state: ReduxState) => {
  return s(state)?.privacyPolicy
}

export const termsAndConditionsContent = (state: ReduxState) => {
  return s(state)?.termsAndConditions
}

export const aboutContent = (state: ReduxState) => {
  return s(state)?.about
}

export const allSurveysSelector = (state: ReduxState) => {
  return s(state)?.allSurveys ?? []
}

export const completedSurveysSelector = (state: ReduxState) => {
  return s(state)?.completedSurveys ?? []
}

export const aboutBannerSelector = (state: ReduxState) => {
  return s(state)?.aboutBanner
}

export const allQuizzesSelectors = (state: ReduxState) => {
  // TODO: FIXME
  const isUserYoungerThan15 = true
  // moment()
  //   .utc()
  //   .diff(state.auth.user.dateOfBirth) < 15
  const quizzes = s(state)?.quizzes
  if (!quizzes?.allIds || !quizzes?.byId) {
    return []
  }
  const filteredArray = quizzes.allIds.reduce<Array<NonNullable<typeof quizzes.byId[string]>>>(
    (acc, id) => {
      const quiz = quizzes.byId?.[id]
      if (!quiz) return acc
      if ((!quiz.isAgeRestricted && isUserYoungerThan15) || !isUserYoungerThan15) {
        acc.push(quiz)
      }
      return acc
    },
    [],
  )

  // In the extreme event of all content being age restricted return the first quiz/ did you know instead of crashing the app

  if (_.isEmpty(filteredArray)) {
    const fallback = quizzes.byId?.[quizzes.allIds[0]]
    return fallback ? [fallback] : []
  }

  return filteredArray
}

export const allDidYouKnowsSelectors = (state: ReduxState) => {
  // TODO: FIXME
  // FYI Age restriction occurs server side now
  const isUserYoungerThan15 = true
  // moment()
  //   .utc()
  //   .diff(state.auth.user.dateOfBirth) < 15
  const didYouKnows = s(state)?.didYouKnows
  if (!didYouKnows?.allIds || !didYouKnows?.byId) {
    return []
  }
  const filteredArray = didYouKnows.allIds.reduce<
    Array<NonNullable<typeof didYouKnows.byId[string]>>
  >((acc, id) => {
    const item = didYouKnows.byId?.[id]
    if (!item) return acc
    if ((!item.isAgeRestricted && isUserYoungerThan15) || !isUserYoungerThan15) {
      acc.push(item)
    }
    return acc
  }, [])

  // In the extreme event of all content being age restricted return the first quiz/ did you know instead of crashing the app
  if (_.isEmpty(filteredArray)) {
    const fallback = didYouKnows.byId?.[didYouKnows.allIds[0]]
    return fallback ? [fallback] : []
  }

  return filteredArray
}
