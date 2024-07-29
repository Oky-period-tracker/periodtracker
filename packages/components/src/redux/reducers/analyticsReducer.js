"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsReducer = analyticsReducer;
const initialState = [];
function analyticsReducer(state = initialState, action) {
    switch (action.type) {
        case 'QUEUE_EVENT':
            return state.concat({
                id: action.payload.id,
                type: action.payload.type,
                payload: action.payload.payload,
                metadata: action.payload.metadata,
            });
        case 'RESET_QUEUE':
            return initialState;
        default:
            return state;
    }
}
//# sourceMappingURL=analyticsReducer.js.map