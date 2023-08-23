import { createAction } from '../helpers'
import {
  Articles,
  Categories,
  SubCategories,
  Surveys,
  Quizzes,
  DidYouKnows,
  HelpCenters,
  AvatarMessages,
  PrivacyPolicy,
  TermsAndConditions,
  About,
  AllSurveys,
  CompletedSurveys,
} from '../../types'

export function initStaleContent({
  articles,
  avatarMessages,
  categories,
  subCategories,
  surveys,
  quizzes,
  didYouKnows,
  helpCenters,
  privacyPolicy,
  termsAndConditions,
  about,
  aboutBanner,
  allSurveys,
  completedSurveys,
}: {
  articles: Articles
  avatarMessages: AvatarMessages
  categories: Categories
  subCategories: SubCategories
  surveys: Surveys
  quizzes: Quizzes
  didYouKnows: DidYouKnows
  helpCenters: HelpCenters
  privacyPolicy: PrivacyPolicy
  termsAndConditions: TermsAndConditions
  about: About
  aboutBanner: string
  allSurveys: AllSurveys
  completedSurveys: CompletedSurveys
}) {
  return createAction('INIT_STALE_CONTENT', {
    articles,
    avatarMessages,
    categories,
    subCategories,
    surveys,
    allSurveys,
    quizzes,
    didYouKnows,
    helpCenters,
    privacyPolicy,
    termsAndConditions,
    about,
    aboutBanner,
    completedSurveys,
  })
}

export function fetchSurveyContentRequest(userID: string) {
  return createAction('FETCH_SURVEY_CONTENT_REQUEST', { userID })
}

export function fetchSurveyContentSuccess({ surveys }: { surveys: Surveys }) {
  return createAction('FETCH_SURVEY_CONTENT_SUCCESS', {
    surveys,
  })
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

export function fetchSurveyContentFailure() {
  return createAction('FETCH_SURVEY_CONTENT_FAILURE')
}

export function fetchContentRequest(locale: string) {
  return createAction('FETCH_CONTENT_REQUEST', { locale })
}

export function fetchContentSuccess({
  articles,
  avatarMessages,
  categories,
  subCategories,
  quizzes,
  didYouKnows,
  helpCenters,
  privacyPolicy,
  termsAndConditions,
  about,
  aboutBanner,
}: {
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
  aboutBanner: string
}) {
  return createAction('FETCH_CONTENT_SUCCESS', {
    articles,
    avatarMessages,
    categories,
    subCategories,
    quizzes,
    didYouKnows,
    helpCenters,
    privacyPolicy,
    termsAndConditions,
    about,
    aboutBanner,
  })
}

export function fetchContentFailure() {
  return createAction('FETCH_CONTENT_FAILURE')
}
