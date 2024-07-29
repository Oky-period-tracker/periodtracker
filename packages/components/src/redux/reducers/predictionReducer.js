"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.predictionReducer = predictionReducer;
const initialState = null;
function predictionReducer(state = initialState, action) {
    var _a;
    switch (action.type) {
        case 'REFRESH_STORE': {
            if (!((_a = action === null || action === void 0 ? void 0 : action.payload) === null || _a === void 0 ? void 0 : _a.prediction)) {
                return state;
            }
            return Object.assign(Object.assign({}, state), action.payload.prediction);
        }
        case 'SET_PREDICTION_ENGINE_STATE':
            return action.payload.predictionState.toJSON();
        case 'SMART_PREDICTION_FAILURE':
            return Object.assign({}, state);
        case 'USER_SET_FUTURE_PREDICTION_STATE_ACTIVE':
        case 'SET_FUTURE_PREDICTION_STATE_ACTIVE':
            return Object.assign(Object.assign({}, state), { futurePredictionStatus: action.payload.isFuturePredictionActive, actualCurrentStartDate: !action.payload.isFuturePredictionActive
                    ? action.payload.currentStartDate
                    : null });
        case 'SET_ACTUAL_STARTDATE':
            return Object.assign(Object.assign({}, state), { actualCurrentStartDate: null });
        default:
            return state;
    }
}
//# sourceMappingURL=predictionReducer.js.map