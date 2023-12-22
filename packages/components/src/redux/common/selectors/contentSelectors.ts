import _ from 'lodash'
import { CommonReduxState } from '../reducers'

const s = (state: CommonReduxState) => state.content

export const allArticlesSelector = (state: CommonReduxState) =>
  s(state).articles.allIds.map((id) => s(state).articles.byId[id])

export const allVideosSelector = (state: CommonReduxState) => {
  if (!s(state)?.videos?.allIds || !s(state)?.videos?.byId) return []
  return s(state).videos.allIds.map((id) => s(state).videos.byId[id])
}

export const articleByIDSelector = (state: CommonReduxState, id) => s(state).articles.byId[id]
export const videoByIDSelector = (state: CommonReduxState, id) => s(state)?.videos?.byId[id]

export const articlesObjectByIDSelector = (state: CommonReduxState) => s(state).articles.byId

// @ts-ignore
export const allHelpCentersForCurrentLocale: any = (state: CommonReduxState) =>
  s(state).helpCenters.filter((item) => item.lang === state.app.locale)

export const allCategoriesSelector = (state: CommonReduxState) =>
  s(state).categories.allIds.map((id) => s(state).categories.byId[id])

export const allCategoryEmojis = (state: CommonReduxState) => {
  const categories = allCategoriesSelector(state)

  return categories.map((item) => {
    return { tag: item.tags.primary.name, emoji: item.tags.primary.emoji }
  })
}

export const allSubCategoriesSelector = (state: CommonReduxState) =>
  s(state).subCategories.allIds.map((id) => s(state).subCategories.byId[id])

export const allSubCategoriesObjectSelector = (state: CommonReduxState) =>
  s(state).subCategories.byId

export const categoryByIDSelector = (state: CommonReduxState, id) => s(state).categories.byId[id]

export const subCategoryByIDSelector = (state: CommonReduxState, id) =>
  s(state).subCategories.byId[id]

export const allAvatarText = (state: CommonReduxState) => s(state).avatarMessages

export const privacyContent = (state: CommonReduxState) => s(state).privacyPolicy

export const termsAndConditionsContent = (state: CommonReduxState) => s(state).termsAndConditions

export const aboutContent = (state: CommonReduxState) => s(state).about

export const allSurveys = (state: CommonReduxState) => s(state).allSurveys

export const completedSurveys = (state: CommonReduxState) => s(state).completedSurveys

export const aboutBanner = (state: CommonReduxState) => s(state).aboutBanner

export const allQuizzesSelectors = (state: CommonReduxState) => {
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

export const allDidYouKnowsSelectors = (state: CommonReduxState) => {
  // TODO_ALEX: FIXME
  const isUserYoungerThan15 = true
  // moment()
  //   .utc()
  //   .diff(state.auth.user.dateOfBirth) < 15
  const filteredArray = s(state).didYouKnows.allIds.reduce((acc, id) => {
    if (
      (!s(state).didYouKnows.byId[id]?.isAgeRestricted && isUserYoungerThan15) ||
      !isUserYoungerThan15
    ) {
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
