import { createAction } from '../helpers'
import {
  Articles,
  Categories,
  SubCategories,
  Quizzes,
  DidYouKnows,
  HelpCenters,
  AvatarMessages,
  PrivacyPolicy,
  TermsAndConditions,
  About,
  AllSurveys,
  CompletedSurveys,
  Videos,
  HelpCenterAttributes,
} from '../../core/types'

export function initStaleContent(payload: {
  articles: Articles
  avatarMessages: AvatarMessages
  categories: Categories
  subCategories: SubCategories
  quizzes: Quizzes
  didYouKnows: DidYouKnows
  helpCenters: HelpCenters
  privacyPolicy: PrivacyPolicy
  termsAndConditions: TermsAndConditions
  about: About
  aboutBanner?: string
}) {
  return createAction('INIT_STALE_CONTENT', payload)
}

export function fetchSurveyContentRequest(userID: string) {
  return createAction('FETCH_SURVEY_CONTENT_REQUEST', { userID })
}

export function updateAllSurveyContent(allSurveys: AllSurveys) {
  return createAction('UPDATE_ALL_SURVEYS_CONTENT', {
    allSurveys,
  })
}
export function updateCompletedSurveys(completedSurveys: CompletedSurveys) {
  return createAction('UPDATE_COMPLETED_SURVEYS', {
    completedSurveys,
  })
}

export function fetchContentRequest(locale: string) {
  return createAction('FETCH_CONTENT_REQUEST', { locale })
}

export function fetchContentSuccess(payload: {
  timeFetched: number
  articles: Articles
  videos: Videos
  avatarMessages: AvatarMessages
  categories: Categories
  subCategories: SubCategories
  quizzes: Quizzes
  didYouKnows: DidYouKnows
  helpCenters: HelpCenters
  helpCenterAttributes: HelpCenterAttributes
  privacyPolicy: PrivacyPolicy
  termsAndConditions: TermsAndConditions
  about: About
  aboutBanner?: string
  aboutBannerTimestamp?: number
}) {
  return createAction('FETCH_CONTENT_SUCCESS', payload)
}

export function fetchContentFailure() {
  return createAction('FETCH_CONTENT_FAILURE')
}
