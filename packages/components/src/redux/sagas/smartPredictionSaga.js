"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smartPredictionbSaga = smartPredictionbSaga;
const effects_1 = require("redux-saga/effects");
const HttpClient_1 = require("../../services/HttpClient");
const actions = __importStar(require("../actions"));
const prediction_1 = require("../../prediction");
function* onFetchUpdatedPredictedCycles(action) {
    try {
        const { age, period_lengths, cycle_lengths, predictionFullState, futurePredictionStatus, } = action.payload;
        let predictionResult = null;
        predictionResult = yield HttpClient_1.httpClient.getPeriodCycles({
            age,
            period_lengths,
            cycle_lengths,
        });
        const stateToSet = prediction_1.PredictionState.fromData({
            isActive: predictionFullState.isActive,
            startDate: predictionFullState.currentCycle.startDate,
            periodLength: predictionFullState.currentCycle.periodLength,
            cycleLength: predictionFullState.currentCycle.cycleLength,
            smaCycleLength: predictionResult.predicted_cycles[0],
            smaPeriodLength: predictionResult.predicted_periods[0],
            history: predictionFullState.history,
            actualCurrentStartDate: predictionFullState.currentCycle,
        });
        yield (0, effects_1.put)(actions.setPredictionEngineState(stateToSet));
        yield (0, effects_1.put)(actions.updateFuturePrediction(futurePredictionStatus, predictionFullState.currentCycle));
    }
    catch (error) {
        yield (0, effects_1.put)(actions.setSmartPredictionFailure(error));
    }
}
function* smartPredictionbSaga() {
    yield (0, effects_1.all)([(0, effects_1.takeLatest)('SMART_PREDICTION_REQUEST', onFetchUpdatedPredictedCycles)]);
}
//# sourceMappingURL=smartPredictionSaga.js.map