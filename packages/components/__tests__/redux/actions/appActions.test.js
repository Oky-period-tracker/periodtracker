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
const redux_mock_store_1 = __importDefault(require("redux-mock-store"));
const actions = __importStar(require("../../../src/redux/actions"));
const middleWares = [];
const mockStore = (0, redux_mock_store_1.default)(middleWares);
describe('appActions', () => {
    const initialState = {};
    const store = mockStore(initialState);
    it('Set Avatar action', () => {
        const action = actions.setAvatar('nur');
        // Dispatch the action
        store.dispatch(action);
        // Test if your store dispatched the expected actions
        const scopedActions = store.getActions();
        const expectedType = `SET_AVATAR`;
        expect(scopedActions[0].type).toEqual(expectedType);
    });
    it('Set Theme action', () => {
        const action = actions.setTheme('hills');
        // Dispatch the action
        store.dispatch(action);
        // Test if your store dispatched the expected actions
        const scopedActions = store.getActions();
        const expectedPayLoad = { theme: 'hills' };
        expect(scopedActions[1].payload).toEqual(expectedPayLoad);
    });
});
//# sourceMappingURL=appActions.test.js.map