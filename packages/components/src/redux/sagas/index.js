"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootSaga = rootSaga;
const effects_1 = require("redux-saga/effects");
const analyticsSaga_1 = require("./analyticsSaga");
const appSaga_1 = require("./appSaga");
const authSaga_1 = require("./authSaga");
const contentSaga_1 = require("./contentSaga");
const smartPredictionSaga_1 = require("./smartPredictionSaga");
function* rootSaga() {
    yield (0, effects_1.all)([
        (0, effects_1.fork)(analyticsSaga_1.analyticsSaga),
        (0, effects_1.fork)(appSaga_1.appSaga),
        (0, effects_1.fork)(authSaga_1.authSaga),
        (0, effects_1.fork)(contentSaga_1.contentSaga),
        (0, effects_1.fork)(smartPredictionSaga_1.smartPredictionbSaga),
    ]);
}
//# sourceMappingURL=index.js.map