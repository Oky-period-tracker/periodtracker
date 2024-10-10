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
  return articles.allIds.map((id) => articles.byId?.[id]).filter(isDefined)
}

export const allVideosSelector = (state: ReduxState) => {
  const videos = s(state)?.videos
  if (!videos?.allIds || !videos?.byId) {
    return []
  }
  return videos.allIds.map((id) => videos.byId?.[id]).filter(isDefined)
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
  if (!categories?.allIds || !categories?.byId) {
    return []
  }
  return categories.allIds.map((id) => categories?.byId?.[id]).filter(isDefined)
}

export const allSubCategoriesSelector = (state: ReduxState) => {
  const subCategories = s(state)?.subCategories
  if (!subCategories?.byId || !subCategories?.allIds) {
    return []
  }
  return subCategories?.allIds.map((id) => subCategories.byId?.[id]).filter(isDefined)
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
  const tempArr = []
  const filteredArray = s(state).quizzes.allIds.reduce((acc, id) => {
    if (
      (!s(state).quizzes.byId[id]?.isAgeRestricted && isUserYoungerThan15) ||
      !isUserYoungerThan15
    ) {
      tempArr.push(s(state).quizzes.byId[id])
    }
    if (
      (!s(state).quizzes.byId[id].isAgeRestricted && isUserYoungerThan15) ||
      !isUserYoungerThan15
    ) {
      // @ts-expect-error TODO:
      acc.push(s(state).quizzes.byId[id])
    }
    return acc
  }, [])

  // In the extreme event of all content being age restricted return the first quiz/ did you know instead of crashing the app

  if (_.isEmpty(filteredArray)) {
    return [s(state).quizzes.byId[s(state).quizzes.allIds[0]]]
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
  const filteredArray = s(state).didYouKnows.allIds.reduce((acc, id) => {
    if (
      (!s(state).didYouKnows.byId[id]?.isAgeRestricted && isUserYoungerThan15) ||
      !isUserYoungerThan15
    ) {
      // @ts-expect-error TODO:
      acc.push(s(state).didYouKnows.byId[id])
    }
    return acc
  }, [])

  // In the extreme event of all content being age restricted return the first quiz/ did you know instead of crashing the app
  if (_.isEmpty(filteredArray)) {
    return [s(state).didYouKnows.byId[s(state).didYouKnows.allIds[0]]]
  }

  return filteredArray
}
