import { all, call, put, select, takeLatest } from 'redux-saga/effects'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as actions from '../actions'
import * as selectors from '../selectors'
import { REHYDRATE } from 'redux-persist'
import { ActionTypes } from '../types'

const ACTIONS_TO_TRACK: ActionTypes[] = [
  // Access actions
  'SAVE_STORE_CREDENTIALS',
  'SET_STORE_KEYS',
  'CLEAR_LAST_LOGIN',
  'DELETE_USER_ACCESS',
  'EDIT_PASSWORD',
  'EDIT_ANSWER',
]

function* onRehydrate() {
  try {
    const commonStateString = yield call([AsyncStorage, 'getItem'], 'common')
    const commonState = commonStateString ? JSON.parse(commonStateString) : {}

    // @ts-ignore TODO:
    yield put(actions.setCommonState(commonState))
  } catch (error) {
    // Handle errors (e.g., dispatch an error action or log the error)
  }
}

function* onUpdateCommonState() {
  try {
    const commonState = yield select(selectors.commonStateSelector)
    const commonStateString = JSON.stringify(commonState)
    yield call([AsyncStorage, 'setItem'], 'common', commonStateString)
  } catch (error) {
    // Handle errors
  }
}

export function* commonSaga() {
  yield all([
    takeLatest(REHYDRATE, onRehydrate), //
    takeLatest(ACTIONS_TO_TRACK, onUpdateCommonState),
  ])
}
