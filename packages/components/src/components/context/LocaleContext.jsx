"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocaleProvider = LocaleProvider;
const react_1 = __importDefault(require("react"));
const useSelector_1 = require("../../hooks/useSelector");
const i18n_1 = require("../../i18n");
function LocaleProvider({ children }) {
    const locale = (0, useSelector_1.useSelector)(state => state.app.locale);
    const [syncLocale, setSyncLocale] = react_1.default.useState((0, i18n_1.currentLocale)());
    react_1.default.useLayoutEffect(() => {
        if (syncLocale !== locale) {
            (0, i18n_1.configureI18n)(locale);
            setSyncLocale(locale);
        }
    }, [locale, syncLocale]);
    return <react_1.default.Fragment key={`lang-${syncLocale}`}>{children}</react_1.default.Fragment>;
}
//# sourceMappingURL=LocaleContext.jsx.map