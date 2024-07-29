"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAST_SIGN_UP = exports.WEBSITE_URL = exports.PREDICTION_ENDPOINT = exports.API_BASE_CMS_URL = exports.API_BASE_URL = void 0;
const react_native_config_1 = __importDefault(require("react-native-config"));
exports.API_BASE_URL = react_native_config_1.default.API_BASE_URL || 'http://localhost:3000';
exports.API_BASE_CMS_URL = react_native_config_1.default.API_BASE_CMS_URL || 'http://localhost:5000';
exports.PREDICTION_ENDPOINT = react_native_config_1.default.PREDICTION_ENDPOINT;
exports.WEBSITE_URL = react_native_config_1.default.WEBSITE_URL;
// Development purposes only
exports.FAST_SIGN_UP = false;
//# sourceMappingURL=env.js.map