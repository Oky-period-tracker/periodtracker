import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import { RehydrateAction, REHYDRATE } from 'redux-persist'
import { ExtractActionFromActionType } from '../types'
import { liveContent as staleContent } from '@oky/core'
import { httpClient } from '../../services/HttpClient'
import * as selectors from '../selectors'
import * as actions from '../actions'
import _ from 'lodash'
import messaging from '@react-native-firebase/messaging'
import { closeOutTTs } from '../../services/textToSpeech'

function* onRehydrate(action: RehydrateAction) {
  const locale = yield select(selectors.currentLocaleSelector)

  const hasPreviousContentFromStorage = action.payload && action.payload.content

  if (!hasPreviousContentFromStorage) {
    yield put(actions.initStaleContent(staleContent[locale]))
  }

  const now = new Date().getTime()
  // TODO_ALEX what time interval should we use?
  const fetchInterval = 0 // 1000 * 60 * 60 * 24 // 24 hours
  const timeFetched = action.payload && action.payload.content?.timeFetched
  const shouldFetch = !timeFetched || timeFetched + fetchInterval < now

  if (shouldFetch) {
    yield put(actions.fetchContentRequest(locale))
  }
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

  function* fetchContent() {
    const content = yield httpClient.fetchContent({
      locale,
    })

    return content
  }

  try {
    const content = yield fetchContent()

    yield put(
      actions.fetchContentSuccess({
        timeFetched: new Date().getTime(),
        ...content,
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
