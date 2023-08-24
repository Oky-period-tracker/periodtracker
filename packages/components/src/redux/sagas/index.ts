import { all, fork } from 'redux-saga/effects'

import { analyticsSaga } from './analyticsSaga'
import { appSaga } from './appSaga'
import { authSaga } from './authSaga'
import { contentSaga } from './contentSaga'
import { smartPredictionbSaga } from './smartPredictionSaga'

export function* rootSaga() {
  yield all([
    fork(analyticsSaga),
    fork(appSaga),
    fork(authSaga),
    fork(contentSaga),
    fork(smartPredictionbSaga),
  ])
}
