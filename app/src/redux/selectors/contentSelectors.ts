import _ from 'lodash'
import { ReduxState } from '../reducers'
import { isDefined } from '../../services/utils'

const s = (state: ReduxState) => state.content

export const articlesSelector = (state: ReduxState) => s(state).articles

export const allArticlesSelector = (state: ReduxState) => {
  const articles = s(state)?.articles
  if (!articles?.allIds || !articles?.byId) {
    return []
  }
  return articles.allIds.map((id: any) => articles.byId?.[id]).filter(isDefined)
}

export const allVideosSelector = (state: ReduxState) => {
  const videos = s(state)?.videos
  if (!videos?.allIds || !videos?.byId) {
    return []
  }
  return videos.allIds.map((id: any) => videos.byId?.[id]).filter(isDefined)
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
  return s(state).helpCenters.filter((item: any) => item.lang === state.app?.locale)
}

export const helpCenterAttributesSelector = (state: ReduxState) => {
  return s(state).helpCenterAttributes
}

export const allCategoriesSelector = (state: ReduxState) => {
  const categories = s(state)?.categories
  if (!categories?.allIds || !categories?.byId) {
    return []
  }
  return categories.allIds.map((id: any) => categories?.byId?.[id]).filter(isDefined)
}

export const allSubCategoriesSelector = (state: ReduxState) => {
  const subCategories = s(state)?.subCategories
  if (!subCategories?.byId || !subCategories?.allIds) {
    return []
  }
  return subCategories?.allIds.map((id: any) => subCategories.byId?.[id]).filter(isDefined)
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
  const quizzes = s(state)?.quizzes
  if (!quizzes?.allIds || !quizzes?.byId) {
    return []
  }
  // moment()
  //   .utc()
  //   .diff(state.auth.user.dateOfBirth) < 15
  const filteredArray = quizzes?.allIds.reduce((acc: any, id: any) => {
    const quiz = quizzes.byId?.[id]
    if (!quiz) return acc
    if ((!quiz.isAgeRestricted && isUserYoungerThan15) || !isUserYoungerThan15) {
      acc.push(quiz)
    }
    return acc
  }, [])

  // In the extreme event of all content being age restricted return the first quiz/ did you know instead of crashing the app

  if (_.isEmpty(filteredArray)) {
    const firstQuiz = quizzes.byId?.[quizzes.allIds[0]]
    return firstQuiz ? [firstQuiz] : []
  }

  return filteredArray
}

export const allDidYouKnowsSelectors = (state: ReduxState) => {
  // TODO: FIXME
  // FYI Age restriction occurs server side now
  const isUserYoungerThan15 = true
  const didYouKnows = s(state)?.didYouKnows
  if (!didYouKnows?.allIds || !didYouKnows?.byId) {
    return []
  }
  // moment()
  //   .utc()
  //   .diff(state.auth.user.dateOfBirth) < 15
  const filteredArray = didYouKnows.allIds.reduce((acc: any, id: any) => {
    const item = didYouKnows.byId?.[id]
    if (!item) return acc

    if ((!item.isAgeRestricted && isUserYoungerThan15) || !isUserYoungerThan15) {
      acc.push(item)
    }

    return acc
  }, [])

  // In the extreme event of all content being age restricted return the first quiz/ did you know instead of crashing the app
  if (_.isEmpty(filteredArray)) {
    const firstItem = didYouKnows.byId?.[didYouKnows.allIds[0]]
    return firstItem ? [firstItem] : []
  }

  return filteredArray
}
