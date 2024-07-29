"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueEvent = queueEvent;
exports.resetQueue = resetQueue;
const helpers_1 = require("../helpers");
function queueEvent(payload) {
    return (0, helpers_1.createAction)('QUEUE_EVENT', payload);
}
function resetQueue() {
    return (0, helpers_1.createAction)('RESET_QUEUE');
}
//# sourceMappingURL=analyticsActions.js.map