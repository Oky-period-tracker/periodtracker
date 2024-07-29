"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDebounce = useDebounce;
const react_1 = require("react");
const useDebouncedCallback_1 = __importDefault(require("./useDebouncedCallback"));
function valueEquality(left, right) {
    return left === right;
}
function useDebounce(value, delay, options) {
    const eq = options && options.equalityFn ? options.equalityFn : valueEquality;
    const [state, dispatch] = (0, react_1.useState)(value);
    const [callback, cancel, callPending] = (0, useDebouncedCallback_1.default)((0, react_1.useCallback)(val => dispatch(val), []), delay, options);
    const previousValue = (0, react_1.useRef)(value);
    (0, react_1.useEffect)(() => {
        // We need to use this condition otherwise we will run debounce timer for the first render (including maxWait option)
        if (!eq(previousValue.current, value)) {
            callback(value);
            previousValue.current = value;
        }
    }, [value, callback, eq]);
    return [state, cancel, callPending];
}
//# sourceMappingURL=useDebounce.js.map