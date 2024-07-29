"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAction = createAction;
function createAction(type, payload) {
    const action = payload === undefined ? { type } : { type, payload };
    return action;
}
//# sourceMappingURL=index.js.map