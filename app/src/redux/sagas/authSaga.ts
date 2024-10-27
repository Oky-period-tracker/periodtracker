import { all, put, select, takeLatest } from 'redux-saga/effects'
import { ExtractActionFromActionType } from '../types'
import { httpClient } from '../../services/HttpClient'
import * as actions from '../actions'
import * as selectors from '../selectors'
import { PredictionState } from '../../prediction'
import moment from 'moment'
import { fetchNetworkConnectionStatus } from '../../services/network'

function* onConvertGuestAccount(action: ExtractActionFromActionType<'CONVERT_GUEST_ACCOUNT'>) {
  yield put(actions.createAccountRequest(action.payload))
}

function* onJourneyCompletion(action: ExtractActionFromActionType<'JOURNEY_COMPLETION'>) {
  const { isActive, startDate, periodLength, cycleLength } = action.payload
  // @ts-expect-error TODO:
  const currentUser = yield select(selectors.currentUserSelector)
  const periodResult = null
  // @ts-expect-error TODO:
  if (yield fetchNetworkConnectionStatus()) {
    try {
      // @ts-expect-error TODO:
      periodResult = yield httpClient.getPeriodCycles({
        age: moment().diff(moment(currentUser.dateOfBirth), 'years'),
        period_lengths: [0, 0, 0, 0, 0, 0, 0, 0, 0, periodLength],
        cycle_lengths: [0, 0, 0, 0, 0, 0, 0, 0, 0, cycleLength],
      })
    } catch (error) {
      // console.log( error);
    }
  }

  const stateToSet = PredictionState.fromData({
    isActive,
    startDate,
    periodLength,
    cycleLength,
    smaCycleLength: periodResult
      ? // @ts-expect-error TODO:
        periodResult.predicted_cycles[0]
      : cycleLength,
    smaPeriodLength: periodResult
      ? // @ts-expect-error TODO:
        periodResult.predicted_periods[0]
      : periodLength,
    history: [],
  })

  yield put(actions.setPredictionEngineState(stateToSet))
}

export function* authSaga() {
  yield all([
    takeLatest('CONVERT_GUEST_ACCOUNT', onConvertGuestAccount),
    takeLatest('JOURNEY_COMPLETION', onJourneyCompletion),
  ])
}
