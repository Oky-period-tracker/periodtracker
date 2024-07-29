"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentUserSelector = exports.authError = exports.appTokenSelector = void 0;
const s = (state) => state.auth;
const appTokenSelector = (state) => s(state).appToken;
exports.appTokenSelector = appTokenSelector;
const authError = (state) => s(state).error;
exports.authError = authError;
const currentUserSelector = (state) => s(state).user;
exports.currentUserSelector = currentUserSelector;
//# sourceMappingURL=authSelectors.js.map