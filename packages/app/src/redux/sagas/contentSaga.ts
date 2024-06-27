import { all, put, select, takeLatest } from "redux-saga/effects";
import { RehydrateAction, REHYDRATE } from "redux-persist";
import { ExtractActionFromActionType } from "../types";
// import { liveContent as staleContent } from "@oky/core";
import { httpClient } from "../../services/HttpClient";
import * as selectors from "../selectors";
import * as actions from "../actions";
import { liveContent as staleContent } from "../../core/modules";
// import messaging from '@react-native-firebase/messaging' TODO:

function* onRehydrate(action: RehydrateAction) {
  // @ts-expect-error TODO:
  const locale = yield select(selectors.currentLocaleSelector);

  const hasPreviousContentFromStorage =
    // @ts-expect-error TODO:
    action.payload && action.payload.content;

  if (!hasPreviousContentFromStorage) {
    // @ts-expect-error TODO:
    yield put(actions.initStaleContent(staleContent[locale]));
  }

  const now = new Date().getTime();
  // TODO_ALEX what time interval should we use?
  const fetchInterval = 0; // 1000 * 60 * 60 * 24 // 24 hours
  // @ts-expect-error TODO:
  const timeFetched = action.payload && action.payload.content?.timeFetched;
  const shouldFetch = !timeFetched || timeFetched + fetchInterval < now;

  if (shouldFetch) {
    yield put(actions.fetchContentRequest(locale));
  }
}

// TODO_ALEX: survey
function* onFetchSurveyContent(
  _: ExtractActionFromActionType<"FETCH_SURVEY_CONTENT_REQUEST">
) {
  // @ts-expect-error TODO:
  const locale = yield select(selectors.currentLocaleSelector);
  // @ts-expect-error TODO:
  const userID = yield select(selectors.currentUserSelector);
  try {
    // @ts-expect-error TODO:
    const surveys = yield httpClient.fetchSurveys({
      locale,
      userID,
    });
    // @ts-expect-error TODO:
    const previousSurveys = yield select(selectors.allSurveys);
    // @ts-expect-error TODO:
    const completedSurveys = yield select(selectors.completedSurveys);
    const newSurveyArr = previousSurveys?.length ? previousSurveys : [];
    // @ts-expect-error TODO:
    surveys.forEach((item) => {
      // @ts-expect-error TODO:
      const itemExits = _.find(previousSurveys, { id: item.id });
      if (!itemExits) {
        newSurveyArr.push(item);
      }
    });
    // @ts-expect-error TODO:
    const finalArr = [];
    // @ts-expect-error TODO:
    newSurveyArr.forEach((item) => {
      // @ts-expect-error TODO:
      const itemExits = _.find(completedSurveys, { id: item.id });
      if (!itemExits) {
        finalArr.push(item);
      }
    });

    // @ts-expect-error TODO:
    yield put(actions.updateAllSurveyContent(finalArr));
  } catch (error) {
    //
  }
}

function* onFetchContentRequest(
  action: ExtractActionFromActionType<"FETCH_CONTENT_REQUEST">
) {
  const { locale } = action.payload;

  function* fetchContent() {
    // @ts-expect-error TODO:
    const content = yield httpClient.fetchContent({
      locale,
    });

    return content;
  }

  try {
    // @ts-expect-error TODO:
    const content = yield fetchContent();

    yield put(
      actions.fetchContentSuccess({
        timeFetched: new Date().getTime(),
        ...content,
      })
    );
  } catch (error) {
    yield put(actions.fetchContentFailure());
    // @ts-expect-error TODO:
    const aboutContent = yield select(selectors.aboutContent);
    if (!aboutContent) {
      // @ts-expect-error TODO:
      const localeInit = yield select(selectors.currentLocaleSelector);
      // @ts-expect-error TODO:
      yield put(actions.initStaleContent(staleContent[localeInit]));
    }
  }
}

function* onSetLocale(action: ExtractActionFromActionType<"SET_LOCALE">) {
  const { locale } = action.payload;
  // @ts-expect-error TODO:
  const isTtsActive = yield select(selectors.isTtsActiveSelector);
  if (isTtsActive) {
    // yield call(closeOutTTs)
    yield put(actions.setTtsActive(false));
  }
  // unsubscribe from topic
  // TODO_ALEX: use locales from submodule
  // messaging().unsubscribeFromTopic("oky_en_notifications");
  // messaging().unsubscribeFromTopic("oky_id_notifications");
  // messaging().unsubscribeFromTopic("oky_mn_notifications");
  // messaging().subscribeToTopic(`oky_${locale}_notifications`);
  // @ts-expect-error TODO:
  yield put(actions.initStaleContent(staleContent[locale]));

  yield put(actions.fetchContentRequest(locale));
}

export function* contentSaga() {
  yield all([
    takeLatest(REHYDRATE, onRehydrate),
    takeLatest("SET_LOCALE", onSetLocale),
    takeLatest("FETCH_CONTENT_REQUEST", onFetchContentRequest),
    takeLatest("FETCH_SURVEY_CONTENT_REQUEST", onFetchSurveyContent),
  ]);
}
