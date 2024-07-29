"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCheckDayWarning = void 0;
const DisplayTextContext_1 = require("../components/context/DisplayTextContext");
const PredictionProvider_1 = require("../components/context/PredictionProvider");
const moment_1 = __importDefault(require("moment"));
const useCheckDayWarning = () => {
    const { setDisplayTextStatic } = (0, DisplayTextContext_1.useDisplayText)();
    const currentCycleInfo = (0, PredictionProvider_1.useTodayPrediction)();
    return (inputDay) => {
        const diffFromStart = inputDay.diff(currentCycleInfo.date, 'days');
        if ((0, moment_1.default)(inputDay).isAfter((0, moment_1.default)())) {
            setDisplayTextStatic('too_far_ahead');
            return true;
        }
        if (diffFromStart < -14 && currentCycleInfo.cycleDay !== 0) {
            setDisplayTextStatic('too_far_behind');
            return true;
        }
        if (diffFromStart > 14 && currentCycleInfo.cycleDay !== 0) {
            // The 0 check is for the use case when there is no history and you move the period forward by accident and put yourself in a state that the cycle has no current information
            setDisplayTextStatic('too_far_ahead');
            return true;
        }
        return false;
    };
};
exports.useCheckDayWarning = useCheckDayWarning;
//# sourceMappingURL=usePredictionWarnings.js.map