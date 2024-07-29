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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PredictionProvider = PredictionProvider;
exports.usePredictionDispatch = usePredictionDispatch;
exports.usePredictionEngine = usePredictionEngine;
exports.useUndoPredictionEngine = useUndoPredictionEngine;
exports.useCalculateFullInfoForDateRange = useCalculateFullInfoForDateRange;
exports.useCalculateStatusForDateRange = useCalculateStatusForDateRange;
exports.useTodayPrediction = useTodayPrediction;
exports.usePredictDay = usePredictDay;
exports.usePredictionEngineState = usePredictionEngineState;
exports.useHistoryPrediction = useHistoryPrediction;
exports.useIsActiveSelector = useIsActiveSelector;
exports.useActualCurrentStartDateSelector = useActualCurrentStartDateSelector;
exports.useIsVerifySelector = useIsVerifySelector;
const react_1 = __importDefault(require("react"));
const moment_1 = __importDefault(require("moment"));
const lodash_1 = __importDefault(require("lodash"));
const prediction_1 = require("../../prediction");
const useSelector_1 = require("../../hooks/useSelector");
const react_redux_1 = require("react-redux");
const actions = __importStar(require("../../redux/actions"));
const PredictionEngineContext = react_1.default.createContext(undefined);
const PredictionDispatchContext = react_1.default.createContext(undefined);
const UndoPredictionStateContext = react_1.default.createContext(undefined);
const defaultState = prediction_1.PredictionState.fromData({
    isActive: true,
    startDate: (0, moment_1.default)().startOf('day'),
    periodLength: 5,
    cycleLength: 30,
    history: [],
});
function PredictionProvider({ children }) {
    const reduxDispatch = (0, react_redux_1.useDispatch)();
    const predictionState = (0, useSelector_1.useSelector)((state) => state.prediction);
    const [predictionSnapshots, setPredictionSnapshots] = react_1.default.useState([]);
    const predictionEngine = react_1.default.useMemo(() => {
        const state = (predictionState === null || predictionState === void 0 ? void 0 : predictionState.currentCycle)
            ? prediction_1.PredictionState.fromJSON(predictionState)
            : defaultState;
        return prediction_1.PredictionEngine.fromState(state);
    }, [predictionState]);
    const predictionDispatch = react_1.default.useCallback((action) => {
        setPredictionSnapshots((snapshots) => snapshots.concat(predictionState));
        predictionEngine.userInputDispatch(action);
        reduxDispatch(actions.adjustPrediction(action));
    }, [predictionState, reduxDispatch, predictionEngine]);
    react_1.default.useEffect(() => {
        return predictionEngine.subscribe((nextPredictionState) => {
            reduxDispatch(actions.setPredictionEngineState(nextPredictionState));
        });
    }, [reduxDispatch, predictionEngine]);
    const undo = react_1.default.useCallback(() => {
        if (predictionSnapshots.length > 0) {
            const lastSnapshot = lodash_1.default.last(predictionSnapshots);
            reduxDispatch(actions.setPredictionEngineState(prediction_1.PredictionState.fromJSON(lastSnapshot)));
            setPredictionSnapshots((snapshots) => snapshots.slice(0, -1));
        }
    }, [predictionSnapshots]);
    return (<PredictionEngineContext.Provider value={predictionEngine}>
      <PredictionDispatchContext.Provider value={predictionDispatch}>
        <UndoPredictionStateContext.Provider value={undo}>
          {children}
        </UndoPredictionStateContext.Provider>
      </PredictionDispatchContext.Provider>
    </PredictionEngineContext.Provider>);
}
function usePredictionDispatch() {
    const context = react_1.default.useContext(PredictionDispatchContext);
    if (context === undefined) {
        throw new Error(`usePredictionDispatch must be used within a PredictionProvider`);
    }
    return context;
}
function usePredictionEngine() {
    const context = react_1.default.useContext(PredictionEngineContext);
    if (context === undefined) {
        throw new Error(`usePredictionEngine must be used within a PredictionProvider`);
    }
    return context;
}
function useUndoPredictionEngine() {
    const context = react_1.default.useContext(UndoPredictionStateContext);
    if (context === undefined) {
        throw new Error(`useUndoPredictionEngine must be used within a PredictionProvider`);
    }
    return context;
}
function useCalculateFullInfoForDateRange(startDate, endDate) {
    const predictionEngine = usePredictionEngine();
    return react_1.default.useMemo(() => {
        return predictionEngine.calculateFullInfoForDateRange(startDate, endDate);
    }, [predictionEngine, startDate, endDate]);
}
function useCalculateStatusForDateRange(startDate, endDate, verifiedPeriodsData, hasFuturePredictionActive) {
    const predictionEngine = usePredictionEngine();
    return react_1.default.useMemo(() => {
        return predictionEngine.calculateStatusForDateRange(startDate, endDate, verifiedPeriodsData, hasFuturePredictionActive);
    }, [predictionEngine, startDate, endDate, verifiedPeriodsData, hasFuturePredictionActive]);
}
function useTodayPrediction() {
    const predictionEngine = usePredictionEngine();
    return react_1.default.useMemo(() => {
        const today = (0, moment_1.default)().startOf('day');
        return predictionEngine.predictDay(today);
    }, [predictionEngine]);
}
function usePredictDay(inputDay) {
    const predictionEngine = usePredictionEngine();
    return react_1.default.useMemo(() => {
        return predictionEngine.predictDay(inputDay);
    }, [predictionEngine, inputDay]);
}
function usePredictionEngineState() {
    const predictionEngine = usePredictionEngine();
    return react_1.default.useMemo(() => {
        return predictionEngine.getPredictorState();
    }, [predictionEngine]);
}
function useHistoryPrediction() {
    const predictionEngine = usePredictionEngine();
    return react_1.default.useMemo(() => {
        return predictionEngine.getPredictorState().history;
    }, [predictionEngine]);
}
function useIsActiveSelector() {
    const predictionEngine = usePredictionEngine();
    return react_1.default.useMemo(() => {
        return predictionEngine.getPredictorState().isActive;
    }, [predictionEngine]);
}
function useActualCurrentStartDateSelector() {
    const predictionEngine = usePredictionEngine();
    return react_1.default.useMemo(() => {
        return predictionEngine.getPredictorState().actualCurrentStartDate;
    }, [predictionEngine]);
}
function useIsVerifySelector() {
    const predictionEngine = usePredictionEngine();
    return react_1.default.useMemo(() => {
        return predictionEngine.getPredictorState();
    }, [predictionEngine]);
}
//# sourceMappingURL=PredictionProvider.jsx.map