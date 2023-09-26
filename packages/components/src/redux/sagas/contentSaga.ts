import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import { RehydrateAction, REHYDRATE } from 'redux-persist'
import { ExtractActionFromActionType } from '../types'
import {
  fromEncyclopedia,
  fromQuizzes,
  fromDidYouKnows,
  fromSurveys,
  fromHelpCenters,
  fromAvatarMessages,
  liveContent as staleContent,
} from '@oky/core'
import { httpClient } from '../../services/HttpClient'
import * as selectors from '../selectors'
import * as actions from '../actions'
import _ from 'lodash'
import messaging from '@react-native-firebase/messaging'
import { closeOutTTs } from '../../services/textToSpeech'
import { useSelector } from '../../hooks/useSelector'

function* onRehydrate(action: RehydrateAction) {
  const locale = yield select(selectors.currentLocaleSelector)

  const hasPreviousContentFromStorage = action.payload && action.payload.content

  if (!hasPreviousContentFromStorage) {
    yield put(actions.initStaleContent(staleContent[locale]))
  }
  yield put(actions.fetchContentRequest(locale))
}

// TODO_ALEX: survey
function* onFetchSurveyContent(
  action: ExtractActionFromActionType<'FETCH_SURVEY_CONTENT_REQUEST'>,
) {
  const locale = yield select(selectors.currentLocaleSelector)
  const userID = yield select(selectors.currentUserSelector)
  try {
    const surveys = yield httpClient.fetchSurveys({
      locale,
      userID,
    })
    const previousSurveys = yield select(selectors.allSurveys)
    const completedSurveys = yield select(selectors.completedSurveys)
    const newSurveyArr = previousSurveys?.length ? previousSurveys : []
    surveys.forEach((item) => {
      const itemExits = _.find(previousSurveys, { id: item.id })
      if (!itemExits) {
        newSurveyArr.push(item)
      }
    })
    const finalArr = []
    newSurveyArr.forEach((item) => {
      const itemExits = _.find(completedSurveys, { id: item.id })
      if (!itemExits) {
        finalArr.push(item)
      }
    })

    yield put(actions.updateAllSurveyContent(finalArr))
  } catch (error) {
    //
  }
}

function* onFetchContentRequest(action: ExtractActionFromActionType<'FETCH_CONTENT_REQUEST'>) {
  const { locale } = action.payload

  function* fetchEncyclopedia() {
    const encyclopediaResponse = yield httpClient.fetchEncyclopedia({ locale })
    const videosResponse = yield httpClient.fetchVideos({ locale })
    return fromEncyclopedia({ encyclopediaResponse, videosResponse })
  }

  function* fetchPrivacyPolicy() {
    const privacyPolicy = yield httpClient.fetchPrivacyPolicy({
      locale,
    })
    return privacyPolicy
  }

  function* fetchTermsAndConditions() {
    const termsAndConditions = yield httpClient.fetchTermsAndConditions({
      locale,
    })
    return termsAndConditions
  }

  function* fetchAbout() {
    const about = yield httpClient.fetchAbout({
      locale,
    })
    return about
  }

  function* fetchAboutBanner() {
    const aboutBanner = yield httpClient.fetchAboutBanner({
      locale,
    })
    return aboutBanner
  }

  function* fetchHelpCenters() {
    const helpCenterResponse = yield httpClient.fetchHelpCenters({
      locale,
    })
    return fromHelpCenters(helpCenterResponse)
  }

  function* fetchQuizzes() {
    const quizzesResponse = yield httpClient.fetchQuizzes({
      locale,
    })
    return fromQuizzes(quizzesResponse)
  }

  function* fetchDidYouKnows() {
    const didYouKnows = yield httpClient.fetchDidYouKnows({
      locale,
    })
    return fromDidYouKnows(didYouKnows)
  }

  function* fetchAvatarMessages() {
    const avatarMessages = yield httpClient.fetchAvatarMessages({
      locale,
    })
    return fromAvatarMessages(avatarMessages)
  }

  try {
    const { articles, categories, subCategories } = yield fetchEncyclopedia()
    const { quizzes } = yield fetchQuizzes()
    const { didYouKnows } = yield fetchDidYouKnows()
    const { helpCenters } = yield fetchHelpCenters()
    const { avatarMessages } = yield fetchAvatarMessages()
    const privacyPolicy = yield fetchPrivacyPolicy()
    const termsAndConditions = yield fetchTermsAndConditions()
    const about = yield fetchAbout()
    const aboutBanner = yield fetchAboutBanner()

    yield put(
      actions.fetchContentSuccess({
        articles: _.isEmpty(articles.allIds) ? staleContent[locale].articles : articles,
        categories: _.isEmpty(categories.allIds) ? staleContent[locale].categories : categories,
        subCategories: _.isEmpty(subCategories.allIds)
          ? staleContent[locale].subCategories
          : subCategories,
        quizzes: _.isEmpty(quizzes.allIds) ? staleContent[locale].quizzes : quizzes,
        didYouKnows: _.isEmpty(didYouKnows.allIds) ? staleContent[locale].didYouKnows : didYouKnows,
        helpCenters: _.isEmpty(helpCenters) ? staleContent[locale].helpCenters : helpCenters,
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
        aboutBanner: !aboutBanner ? staleContent[locale].aboutBanner : aboutBanner,
      }),
    )
  } catch (error) {
    yield put(actions.fetchContentFailure())
    const aboutContent = yield select(selectors.aboutContent)
    if (!aboutContent) {
      const localeInit = yield select(selectors.currentLocaleSelector)
      yield put(actions.initStaleContent(staleContent[localeInit]))
    }
  }
}

function* onSetLocale(action: ExtractActionFromActionType<'SET_LOCALE'>) {
  const { locale } = action.payload
  const isTtsActive = yield select(selectors.isTtsActiveSelector)
  if (isTtsActive) {
    // TODO_ALEX why?
    yield call(closeOutTTs)
    yield put(actions.setTtsActive(false))
  }
  // unsubscribe from topic
  // TODO_ALEX: use locales from submodule
  messaging().unsubscribeFromTopic('oky_en_notifications')
  messaging().unsubscribeFromTopic('oky_id_notifications')
  messaging().unsubscribeFromTopic('oky_mn_notifications')
  messaging().subscribeToTopic(`oky_${locale}_notifications`)
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
