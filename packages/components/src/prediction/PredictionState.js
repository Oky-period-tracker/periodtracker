"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionState = void 0;
const moment_1 = __importDefault(require("moment"));
const circular_buffer_1 = __importDefault(require("circular-buffer"));
class PredictionState {
    constructor() { }
    static fromData({ startDate = (0, moment_1.default)(), periodLength = 5, isActive = true, cycleLength = 28, smaPeriodLength = 5, smaCycleLength = 28, history = [], futurePredictionStatus = true, actualCurrentStartDate = null, }) {
        const state = new PredictionState();
        state.currentCycle = {
            startDate,
            periodLength,
            cycleLength,
        };
        state.smartPrediction = {
            circularPeriodLength: new circular_buffer_1.default(6),
            circularCycleLength: new circular_buffer_1.default(6),
            smaPeriodLength,
            smaCycleLength,
        };
        state.isActive = isActive;
        state.history = history;
        state.futurePredictionStatus = futurePredictionStatus;
        state.actualCurrentStartDate = actualCurrentStartDate;
        return state;
    }
    static fromJSON({ currentCycle, smartPrediction, history, isActive, futurePredictionStatus, actualCurrentStartDate, }) {
        const { startDate, periodLength, cycleLength } = currentCycle;
        const { smaPeriodLength, smaCycleLength } = smartPrediction;
        const state = PredictionState.fromData({
            startDate: (0, moment_1.default)(startDate),
            isActive,
            periodLength,
            cycleLength,
            smaPeriodLength,
            smaCycleLength,
            history: (history || []).map((entry) => ({
                cycleStartDate: (0, moment_1.default)(entry.cycleStartDate),
                cycleEndDate: (0, moment_1.default)(entry.cycleEndDate),
                periodLength: entry.periodLength,
                cycleLength: entry.cycleLength,
            })),
            futurePredictionStatus,
            actualCurrentStartDate,
        });
        for (const circularBufferKey in ['circularPeriodLength', 'circularCycleLength']) {
            if (!(circularBufferKey in state.smartPrediction)) {
                continue;
            }
            const circularBuffer = state.smartPrediction[circularBufferKey];
            const serializedState = smartPrediction[circularBufferKey] || [];
            serializedState.forEach((value) => {
                circularBuffer.push(value);
            });
        }
        return state;
    }
    toJSON() {
        const { currentCycle, smartPrediction, history, isActive, futurePredictionStatus, actualCurrentStartDate, } = this;
        return {
            isActive,
            currentCycle: Object.assign(Object.assign({}, currentCycle), { startDate: currentCycle.startDate.toISOString() }),
            smartPrediction: Object.assign(Object.assign({}, smartPrediction), { circularPeriodLength: smartPrediction.circularPeriodLength.toarray(), circularCycleLength: smartPrediction.circularCycleLength.toarray() }),
            futurePredictionStatus,
            history: history.map((entry) => (Object.assign(Object.assign({}, entry), { cycleStartDate: entry.cycleStartDate.toISOString(), cycleEndDate: entry.cycleEndDate.toISOString() }))),
            actualCurrentStartDate,
        };
    }
}
exports.PredictionState = PredictionState;
//# sourceMappingURL=PredictionState.js.map