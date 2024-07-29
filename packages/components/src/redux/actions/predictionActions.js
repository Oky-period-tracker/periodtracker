"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPredictionEngineState = setPredictionEngineState;
exports.smartPredictionRequest = smartPredictionRequest;
exports.updateActualCurrentStartDate = updateActualCurrentStartDate;
exports.setSmartPredictionFailure = setSmartPredictionFailure;
exports.adjustPrediction = adjustPrediction;
exports.updateFuturePrediction = updateFuturePrediction;
exports.userUpdateFuturePrediction = userUpdateFuturePrediction;
const helpers_1 = require("../helpers");
function setPredictionEngineState(predictionState) {
    return (0, helpers_1.createAction)('SET_PREDICTION_ENGINE_STATE', { predictionState });
}
function smartPredictionRequest({ cycle_lengths, period_lengths, age, predictionFullState, futurePredictionStatus, }) {
    return (0, helpers_1.createAction)('SMART_PREDICTION_REQUEST', {
        cycle_lengths,
        period_lengths,
        age,
        predictionFullState,
        futurePredictionStatus,
    });
}
function updateActualCurrentStartDate() {
    return (0, helpers_1.createAction)('SET_ACTUAL_STARTDATE');
}
function setSmartPredictionFailure({ error }) {
    return (0, helpers_1.createAction)('SMART_PREDICTION_FAILURE', { error });
}
function adjustPrediction(action) {
    return (0, helpers_1.createAction)('ADJUST_PREDICTION', action);
}
function updateFuturePrediction(isFuturePredictionActive, currentStartDate) {
    return (0, helpers_1.createAction)('SET_FUTURE_PREDICTION_STATE_ACTIVE', {
        isFuturePredictionActive,
        currentStartDate,
    });
}
function userUpdateFuturePrediction(isFuturePredictionActive, currentStartDate) {
    return (0, helpers_1.createAction)('USER_SET_FUTURE_PREDICTION_STATE_ACTIVE', {
        isFuturePredictionActive,
        currentStartDate,
    });
}
//# sourceMappingURL=predictionActions.js.map