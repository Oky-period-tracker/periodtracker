import { all, put, select, takeLatest, delay } from "redux-saga/effects";
import { REHYDRATE } from "redux-persist";
import { Alert } from "react-native";
import { v4 as uuidv4 } from "uuid";
import { ExtractActionFromActionType } from "../types";
import { httpClient } from "../../services/HttpClient";
import { ReduxState } from "../store";
import * as actions from "../actions";
import * as selectors from "../selectors";
// import { navigateAndReset } from "../../services/navigationService";
import { PredictionState } from "../../prediction";
import moment from "moment";
// import { closeOutTTs } from "../../services/textToSpeech";
import { fetchNetworkConnectionStatus } from "../../services/network";
import { PartialStateSnapshot } from "../types/partialStore";

// unwrap promise
type Await<T> = T extends Promise<infer U> ? U : T;

function* onRehydrate() {
  const state: ReduxState = yield select();

  const appToken = selectors.appTokenSelector(state);
  const user = selectors.currentUserSelector(state);

  // convert guest account
  if (!appToken && user && user.isGuest) {
    yield put(actions.convertGuestAccount(user));
  }
}

function* onConvertGuestAccount(
  action: ExtractActionFromActionType<"CONVERT_GUEST_ACCOUNT">
) {
  yield put(actions.createAccountRequest(action.payload));
}

function* onLoginRequest(action: ExtractActionFromActionType<"LOGIN_REQUEST">) {
  const { name, password } = action.payload;
  const stateRedux: ReduxState = yield select();
  const localeapp = selectors.currentLocaleSelector(stateRedux);
  yield actions.setLocale(localeapp);

  try {
    const {
      appToken,
      user,
      store,
    }: Await<ReturnType<typeof httpClient.login>> = yield httpClient.login({
      name,
      password,
    });

    yield put(
      actions.loginSuccess({
        appToken,
        user: {
          ...user,
          name,
          password,
          isGuest: false,
        },
      })
    );

    if (store && store.storeVersion && store.appState) {
      const partialState: PartialStateSnapshot = {
        ...store.appState,
        app: {
          ...store.appState.app,
          appLocale: localeapp,
          locale: localeapp,
        },
      };

      // @TODO: execute migration based on storeVersion
      yield put(actions.refreshStore({ userID: user.id, ...partialState }));
    }

    yield delay(5000); // !!! THis is here for a bug on slower devices that cause the app to crash on sign up. Did no debug further. Note only occurs on much older phones
    //  ===================== TODO: NAVIGATION ===================== //
    // yield call(navigateAndReset, "MainStack", null);
  } catch (error) {
    let errorMessage = "request_fail";
    // @ts-expect-error TODO:
    if (error && error.response && error.response.data) {
      // @ts-expect-error TODO:
      if (error.response.data.name === "BadRequestError") {
        errorMessage = "login_failed";
      }
      // @ts-expect-error TODO:
      if (error.response.data.name !== "BadRequestError") {
        // @ts-expect-error TODO:
        errorMessage = error.response.data.message;
      }
    }
    yield put(
      actions.loginFailure({
        error: errorMessage,
      })
    );
  }
}

function* onCreateAccountRequest(
  action: ExtractActionFromActionType<"CREATE_ACCOUNT_REQUEST">
) {
  const dateSignedUp = moment.utc().toISOString();
  const { id, name, password } = action.payload;

  try {
    const { appToken, user }: Await<ReturnType<typeof httpClient.signup>> =
      yield httpClient.signup({
        ...action.payload,
        preferredId: id || null,
      });
    if (!appToken || !user || !user.id) {
      throw new Error(`Invalid data`);
    }

    yield put(
      actions.createAccountSuccess({
        appToken,
        user: {
          ...user,
          name,
          password,
          dateSignedUp,
          isGuest: false,
        },
      })
    );
  } catch (error) {
    const errorStatusCode =
      // @ts-expect-error TODO:
      error && error.response && error.response.status
        ? // @ts-expect-error TODO:
          error.response.status
        : null; // to check various error codes and respond accordingly
    yield put(actions.setAuthError({ error: errorStatusCode }));
    yield put(actions.createAccountFailure());

    yield put(
      actions.loginSuccessAsGuestAccount({
        ...action.payload,
        id: id || uuidv4(),
        isGuest: true,
      })
    );
  }
}

function* onCreateAccountSuccess(
  action: ExtractActionFromActionType<"CREATE_ACCOUNT_SUCCESS">
) {
  const { appToken, user } = action.payload;
  yield put(
    actions.loginSuccess({
      appToken,
      user: {
        ...user,
      },
    })
  );
}
function* onDeleteAccountRequest(
  action: ExtractActionFromActionType<"DELETE_ACCOUNT_REQUEST">
) {
  // const { setLoading } = action.payload;
  const state: ReduxState = yield select();
  const user = selectors.currentUserSelector(state);
  // setLoading(true);
  try {
    const { name, password } = action.payload;
    yield httpClient.deleteUserFromPassword({
      name,
      password,
    });
    yield put(actions.updateAllSurveyContent([])); // TODO_ALEX
    yield put(actions.updateCompletedSurveys([])); // TODO_ALEX
    yield put(
      actions.fetchSurveyContentSuccess({
        // @ts-expect-error TODO:
        surveys: null,
      }) // TODO_ALEX
    );
    //  ===================== TODO: NAVIGATION ===================== //

    // yield call(navigateAndReset, "LoginStack", null);

    if (user) {
      yield put(actions.logout());
    }
  } catch (err) {
    // setLoading(false);
    Alert.alert("Error", "Unable to delete the account");
  }
}

function* onLogoutRequest() {
  // @ts-expect-error TODO:
  const isTtsActive = yield select(selectors.isTtsActiveSelector);

  if (isTtsActive) {
    // yield call(closeOutTTs);
    yield put(actions.setTtsActive(false));
  }
  yield put(actions.updateAllSurveyContent([])); // TODO_ALEX: survey
  yield put(
    actions.fetchSurveyContentSuccess({
      // @ts-expect-error TODO:
      surveys: null,
    })
  );
  yield put(actions.updateCompletedSurveys([])); // TODO_ALEX: survey
  //  ===================== TODO: NAVIGATION ===================== //

  // yield call(navigateAndReset, "LoginStack", null);
  yield put(actions.logout());
}

function* onJourneyCompletion(
  action: ExtractActionFromActionType<"JOURNEY_COMPLETION">
) {
  const { data } = action.payload;
  // @ts-expect-error TODO:
  const currentUser = yield select(selectors.currentUserSelector);
  let periodResult = null;
  // @ts-expect-error TODO:
  if (yield fetchNetworkConnectionStatus()) {
    try {
      // @ts-expect-error TODO:
      periodResult = yield httpClient.getPeriodCycles({
        age: moment().diff(moment(currentUser.dateOfBirth), "years"),
        // @ts-expect-error TODO:
        period_lengths: [0, 0, 0, 0, 0, 0, 0, 0, 0, data[2].answer + 1],
        cycle_lengths: [
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          0,
          // @ts-expect-error TODO:
          (data[3].answer + 1) * 7 + data[2].answer + 1,
        ],
      });
    } catch (error) {
      // console.log( error);
    }
  }

  const stateToSet = PredictionState.fromData({
    // @ts-expect-error TODO:
    isActive: data[0].answer === "Yes" ? true : false,
    // @ts-expect-error TODO:
    startDate: moment(data[1].answer, "DD-MMM-YYYY"),
    // @ts-expect-error TODO:
    periodLength: data[2].answer + 1,
    // @ts-expect-error TODO:
    cycleLength: (data[3].answer + 1) * 7 + data[2].answer + 1,
    smaCycleLength: periodResult
      ? periodResult.predicted_cycles[0]
      : // @ts-expect-error TODO:
        (data[3].answer + 1) * 7 + data[2].answer + 1,
    smaPeriodLength: periodResult
      ? periodResult.predicted_periods[0]
      : // @ts-expect-error TODO:
        data[2].answer + 1,
    history: [],
  });

  yield put(actions.setPredictionEngineState(stateToSet));
  yield put(actions.updateFuturePrediction(true, null));
  yield put(actions.setTutorialOneActive(true));
  yield put(actions.setTutorialTwoActive(true));
  yield delay(5000); // !!! THis is here for a bug on slower devices that cause the app to crash on sign up. Did no debug further. Note only occurs on much older phones
  //  ===================== TODO: NAVIGATION ===================== //

  // yield call(navigateAndReset, "MainStack", null);
}

export function* authSaga() {
  yield all([
    takeLatest(REHYDRATE, onRehydrate),
    takeLatest("LOGOUT_REQUEST", onLogoutRequest),
    takeLatest("LOGIN_REQUEST", onLoginRequest),
    takeLatest("DELETE_ACCOUNT_REQUEST", onDeleteAccountRequest),
    takeLatest("CREATE_ACCOUNT_REQUEST", onCreateAccountRequest),
    takeLatest("CREATE_ACCOUNT_SUCCESS", onCreateAccountSuccess),
    takeLatest("CONVERT_GUEST_ACCOUNT", onConvertGuestAccount),
    takeLatest("JOURNEY_COMPLETION", onJourneyCompletion),
  ]);
}
