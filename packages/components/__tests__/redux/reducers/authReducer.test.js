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
const uuid_1 = require("uuid");
const moment_1 = __importDefault(require("moment"));
const redux_mock_store_1 = __importDefault(require("redux-mock-store"));
const lodash_1 = __importDefault(require("lodash"));
const actions = __importStar(require("../../../src/redux/actions"));
const authReducer_1 = require("../../../src/redux/reducers/authReducer");
const middleWares = [];
const mockStore = (0, redux_mock_store_1.default)(middleWares);
describe('authReducer', () => {
    const initialState = {};
    const store = mockStore(initialState);
    const mockPayload = {
        id: (0, uuid_1.v4)(),
        name: 'Unit_Test_account',
        dateOfBirth: moment_1.default.utc('01-01-2000', 'DD-MM-YYYY'),
        gender: 'Male',
        location: 'Urban',
        country: 'ZA',
        province: '',
        password: lodash_1.default.toLower('00AAaa').trim(),
        secretQuestion: 'favourite_teacher',
        secretAnswer: lodash_1.default.toLower('secret_answer').trim(),
        dateSignedUp: new Date().toISOString(),
        dateAccountSaved: new Date().toISOString(),
    };
    it('returns the initial state', () => {
        // sanity check of overall auth reducer
        // @ts-ignore
        expect((0, authReducer_1.authReducer)(initialState, {})).toEqual(initialState);
    });
    it('Create account request actions', () => {
        const action = actions.createAccountRequest(Object.assign(Object.assign({}, mockPayload), { id: undefined }));
        // Dispatch the action
        store.dispatch(action);
        // Test if your store dispatched the expected actions
        const scopedActions = store.getActions();
        const expectedType = `CREATE_ACCOUNT_REQUEST`;
        expect(scopedActions[0].type).toEqual(expectedType);
    });
    it('Login As guest account', () => {
        var _a, _b;
        const action = actions.loginSuccessAsGuestAccount(mockPayload);
        const newStore = (0, authReducer_1.authReducer)(undefined, action);
        // Dispatch the action
        expect((_a = newStore === null || newStore === void 0 ? void 0 : newStore.user) === null || _a === void 0 ? void 0 : _a.name).toEqual(mockPayload.name);
        expect((_b = newStore === null || newStore === void 0 ? void 0 : newStore.user) === null || _b === void 0 ? void 0 : _b.isGuest).toEqual(true);
    });
    it('Login Out guest account', () => {
        const action = actions.logout();
        const newStore = (0, authReducer_1.authReducer)(undefined, action);
        // Dispatch the action
        expect(newStore.user).toEqual(null);
    });
    it('Create account faiure', () => {
        const action = actions.createAccountFailure();
        const newStore = (0, authReducer_1.authReducer)(undefined, action);
        // Dispatch the action
        expect(newStore.connectAccountAttempts).toBeGreaterThan(0);
    });
});
//# sourceMappingURL=authReducer.test.js.map