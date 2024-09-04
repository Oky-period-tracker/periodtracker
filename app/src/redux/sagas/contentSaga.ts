import { all, put, select, takeLatest } from 'redux-saga/effects'
import { RehydrateAction, REHYDRATE } from 'redux-persist'
import { ExtractActionFromActionType } from '../types'
import { httpClient } from '../../services/HttpClient'
import * as selectors from '../selectors'
import * as actions from '../actions'
import { Locale, content as staleContent } from '../../resources/translations'
import _ from 'lodash'
import {
  fromAvatarMessages,
  fromDidYouKnows,
  fromEncyclopedia,
  fromHelpCenters,
  fromQuizzes,
} from '../../mappers'

function* onRehydrate(action: RehydrateAction) {
  // @ts-expect-error TODO:
  const locale = yield select(selectors.currentLocaleSelector)

  const hasPreviousContentFromStorage =
    // @ts-expect-error TODO:
    action.payload && action.payload.content

  if (!hasPreviousContentFromStorage) {
    // @ts-expect-error TODO:
    yield put(actions.initStaleContent(staleContent[locale]))
  }

  const now = new Date().getTime()
  // TODO: what time interval should we use?
  const fetchInterval = 0 // 1000 * 60 * 60 * 24 // 24 hours
  // @ts-expect-error TODO:
  const timeFetched = action.payload && action.payload.content?.timeFetched
  const shouldFetch = !timeFetched || timeFetched + fetchInterval < now

  if (shouldFetch) {
    yield put(actions.fetchContentRequest(locale))
  }
}

function* onFetchSurveyContent() {
  // @ts-expect-error TODO:
  const locale = yield select(selectors.currentLocaleSelector)
  // @ts-expect-error TODO:
  const userID = yield select(selectors.currentUserSelector)
  try {
    // @ts-expect-error TODO:
    const surveys = yield httpClient.fetchSurveys({
      locale,
      userID,
    })
    // @ts-expect-error TODO:
    const previousSurveys = yield select(selectors.allSurveysSelector)
    // @ts-expect-error TODO:
    const completedSurveys = yield select(selectors.completedSurveysSelector)
    const newSurveyArr = previousSurveys?.length ? previousSurveys : []
    // @ts-expect-error TODO:
    surveys.forEach((item) => {
      const itemExits = _.find(previousSurveys, { id: item.id })
      if (!itemExits) {
        newSurveyArr.push(item)
      }
    })
    // @ts-expect-error TODO:
    const finalArr = []
    // @ts-expect-error TODO:
    newSurveyArr.forEach((item) => {
      const itemExits = _.find(completedSurveys, { id: item.id })
      if (!itemExits) {
        finalArr.push(item)
      }
    })

    // @ts-expect-error TODO:
    yield put(actions.updateAllSurveyContent(finalArr))
  } catch (error) {
    // console.log("*** error", JSON.stringify(error));
  }
}

function* onFetchContentRequest(action: ExtractActionFromActionType<'FETCH_CONTENT_REQUEST'>) {
  const { locale } = action.payload as { locale: Locale } // TODO:

  function* fetchEncyclopedia() {
    // @ts-expect-error TODO:
    const encyclopediaResponse = yield httpClient.fetchEncyclopedia({ locale })
    // @ts-expect-error TODO:

    const videosResponse = yield httpClient.fetchVideos({ locale })
    return fromEncyclopedia({ encyclopediaResponse, videosResponse })
  }

  function* fetchPrivacyPolicy() {
    // @ts-expect-error TODO:
    const privacyPolicy = yield httpClient.fetchPrivacyPolicy({
      locale,
    })
    return privacyPolicy
  }

  function* fetchTermsAndConditions() {
    // @ts-expect-error TODO:
    const termsAndConditions = yield httpClient.fetchTermsAndConditions({
      locale,
    })
    return termsAndConditions
  }

  function* fetchAbout() {
    // @ts-expect-error TODO:
    const about = yield httpClient.fetchAbout({
      locale,
    })
    return about
  }

  function* fetchAboutBannerConditional() {
    // @ts-expect-error TODO:
    const timestamp = yield select((s) => s.content.aboutBannerTimestamp)
    // @ts-expect-error TODO:
    const aboutBanner = yield httpClient.fetchAboutBannerConditional({
      locale,
      timestamp,
    })
    return aboutBanner
  }

  function* fetchHelpCenters() {
    // @ts-expect-error TODO:
    const helpCenterResponse = yield httpClient.fetchHelpCenters({
      locale,
    })
    return fromHelpCenters(helpCenterResponse)
  }

  function* fetchHelpCentersAttributes() {
    const helpCenterAttributesResponse =
      // @ts-expect-error TODO:
      yield httpClient.fetchHelpCenterAttributes({
        locale,
      })
    return helpCenterAttributesResponse
  }

  function* fetchQuizzes() {
    // @ts-expect-error TODO:
    const quizzesResponse = yield httpClient.fetchQuizzes({
      locale,
    })
    return fromQuizzes(quizzesResponse)
  }

  function* fetchDidYouKnows() {
    // @ts-expect-error TODO:
    const didYouKnows = yield httpClient.fetchDidYouKnows({
      locale,
    })
    return fromDidYouKnows(didYouKnows)
  }

  function* fetchAvatarMessages() {
    // @ts-expect-error TODO:
    const avatarMessages = yield httpClient.fetchAvatarMessages({
      locale,
    })
    return fromAvatarMessages(avatarMessages)
  }

  try {
    const { articles, categories, subCategories, videos } = yield fetchEncyclopedia()
    const { quizzes } = yield fetchQuizzes()
    const { didYouKnows } = yield fetchDidYouKnows()
    const { helpCenters } = yield fetchHelpCenters()
    // @ts-expect-error TODO:
    const helpCenterAttributes = yield fetchHelpCentersAttributes()
    const { avatarMessages } = yield fetchAvatarMessages()
    // @ts-expect-error TODO:
    const privacyPolicy = yield fetchPrivacyPolicy()
    // @ts-expect-error TODO:
    const termsAndConditions = yield fetchTermsAndConditions()
    // @ts-expect-error TODO:
    const about = yield fetchAbout()
    // @ts-expect-error TODO:
    const aboutBannerData = yield fetchAboutBannerConditional()

    yield put(
      actions.fetchContentSuccess({
        timeFetched: new Date().getTime(),
        articles: _.isEmpty(articles.allIds) ? staleContent[locale].articles : articles,
        videos: _.isEmpty(videos.allIds) ? staleContent[locale].videos : videos,
        categories: _.isEmpty(categories.allIds) ? staleContent[locale].categories : categories,
        subCategories: _.isEmpty(subCategories.allIds)
          ? staleContent[locale].subCategories
          : subCategories,
        quizzes: _.isEmpty(quizzes.allIds) ? staleContent[locale].quizzes : quizzes,
        didYouKnows: _.isEmpty(didYouKnows.allIds) ? staleContent[locale].didYouKnows : didYouKnows,
        helpCenters: _.isEmpty(helpCenters) ? staleContent[locale].helpCenters : helpCenters,
        helpCenterAttributes: _.isEmpty(helpCenterAttributes)
          ? staleContent[locale].helpCenterAttributes
          : helpCenterAttributes,
        avatarMessages: _.isEmpty(avatarMessages)
          ? staleContent[locale].avatarMessages
          : avatarMessages,
        privacyPolicy: _.isEmpty(privacyPolicy)
          ? staleContent[locale].privacyPolicy
          : privacyPolicy,
        termsAndConditions: _.isEmpty(termsAndConditions)
          ? staleContent[locale].termsAndConditions
          : termsAndConditions,
        about: _.isEmpty(about) ? staleContent[locale].about : about,
        aboutBanner: aboutBannerData?.aboutBanner,
        aboutBannerTimestamp: aboutBannerData?.aboutBannerTimestamp,
      }),
    )
  } catch (error) {
    yield put(actions.fetchContentFailure())
    // @ts-expect-error TODO:
    const aboutContent = yield select(selectors.aboutContent)
    if (!aboutContent) {
      const localeInit = (yield select(selectors.currentLocaleSelector)) as Locale
      yield put(actions.initStaleContent(staleContent[localeInit]))
    }
  }
}

function* onSetLocale(action: ExtractActionFromActionType<'SET_LOCALE'>) {
  const { locale } = action.payload

  // @ts-expect-error TODO:
  yield put(actions.initStaleContent(staleContent[locale]))

  yield put(actions.fetchContentRequest(locale))
}

export function* contentSaga() {
  yield all([
    takeLatest(REHYDRATE, onRehydrate),
    takeLatest('SET_LOCALE', onSetLocale),
    takeLatest('FETCH_CONTENT_REQUEST', onFetchContentRequest),
    takeLatest('FETCH_SURVEY_CONTENT_REQUEST', onFetchSurveyContent),
  ])
}
