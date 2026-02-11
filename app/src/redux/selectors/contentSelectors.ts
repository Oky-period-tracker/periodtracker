import _ from 'lodash'
import { createSelector } from 'reselect'
import { ReduxState } from '../reducers'
import { isDefined } from '../../services/utils'

// Stable empty references to avoid creating new objects/arrays on every call
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EMPTY_OBJECT = {} as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EMPTY_ARRAY: any[] = []

const s = (state: ReduxState) => state.content

export const articlesSelector = (state: ReduxState) => s(state).articles

export const allArticlesSelector = createSelector(
  [(state: ReduxState) => s(state)?.articles],
  (articles) => {
    if (!articles?.allIds || !articles?.byId) {
      return EMPTY_ARRAY
    }
    return articles.allIds.map((id) => articles.byId?.[id]).filter(isDefined)
  },
)

export const allVideosSelector = createSelector(
  [(state: ReduxState) => s(state)?.videos],
  (videos) => {
    if (!videos?.allIds || !videos?.byId) {
      return EMPTY_ARRAY
    }
    return videos.allIds.map((id) => videos.byId?.[id]).filter(isDefined)
  },
)

export const articleByIDSelector = (state: ReduxState, id: string) => {
  const articles = s(state).articles
  return articles.byId?.[id]
}

export const videoByIDSelector = (state: ReduxState, id: string) => {
  return s(state)?.videos?.byId?.[id]
}

export const articlesObjectByIDSelector = (state: ReduxState) => {
  return s(state).articles?.byId ?? EMPTY_OBJECT
}

export const allHelpCentersForCurrentLocale = createSelector(
  [(state: ReduxState) => s(state).helpCenters, (state: ReduxState) => state.app?.locale],
  (helpCenters, locale) => {
    return helpCenters.filter((item) => item.lang === locale)
  },
)

export const helpCenterAttributesSelector = (state: ReduxState) => {
  return s(state).helpCenterAttributes
}

export const allCategoriesSelector = createSelector(
  [(state: ReduxState) => s(state)?.categories],
  (categories) => {
    if (!categories?.allIds || !categories?.byId) {
      return EMPTY_ARRAY
    }
    return categories.allIds.map((id) => categories?.byId?.[id]).filter(isDefined)
  },
)

export const allSubCategoriesSelector = createSelector(
  [(state: ReduxState) => s(state)?.subCategories],
  (subCategories) => {
    if (!subCategories?.byId || !subCategories?.allIds) {
      return EMPTY_ARRAY
    }
    return subCategories.allIds.map((id) => subCategories.byId?.[id]).filter(isDefined)
  },
)

export const allSubCategoriesByIdSelector = (state: ReduxState) => {
  return s(state)?.subCategories?.byId ?? EMPTY_OBJECT
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

export const translationsSelector = (state: ReduxState) => {
  return s(state)?.translations ?? EMPTY_OBJECT
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
  return s(state)?.allSurveys ?? EMPTY_ARRAY
}

export const completedSurveysSelector = (state: ReduxState) => {
  return s(state)?.completedSurveys ?? EMPTY_ARRAY
}

export const aboutBannerSelector = (state: ReduxState) => {
  return s(state)?.aboutBanner
}

export const allQuizzesSelectors = createSelector(
  [(state: ReduxState) => s(state).quizzes],
  (quizzes) => {
    // TODO: FIXME
    const isUserYoungerThan15 = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredArray = quizzes.allIds.reduce((acc: any[], id) => {
      if (
        (!quizzes.byId[id]?.isAgeRestricted && isUserYoungerThan15) ||
        !isUserYoungerThan15
      ) {
        acc.push(quizzes.byId[id])
      }
      return acc
    }, [])

    // In the extreme event of all content being age restricted return the first quiz instead of crashing
    if (_.isEmpty(filteredArray)) {
      return [quizzes.byId[quizzes.allIds[0]]]
    }

    return filteredArray
  },
)

export const allDidYouKnowsSelectors = createSelector(
  [(state: ReduxState) => s(state).didYouKnows],
  (didYouKnows) => {
    // TODO: FIXME
    const isUserYoungerThan15 = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredArray = didYouKnows.allIds.reduce((acc: any[], id) => {
      if (
        (!didYouKnows.byId[id]?.isAgeRestricted && isUserYoungerThan15) ||
        !isUserYoungerThan15
      ) {
        acc.push(didYouKnows.byId[id])
      }
      return acc
    }, [])

    // In the extreme event of all content being age restricted return the first did you know instead of crashing
    if (_.isEmpty(filteredArray)) {
      return [didYouKnows.byId[didYouKnows.allIds[0]]]
    }

    return filteredArray
  },
)
