"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useDebouncedCallback;
const react_1 = require("react");
function useDebouncedCallback(callback, delay, options = {}) {
    const maxWait = options.maxWait;
    const maxWaitHandler = (0, react_1.useRef)(null);
    const maxWaitArgs = (0, react_1.useRef)([]);
    const leading = options.leading;
    const trailing = options.trailing === undefined ? true : options.trailing;
    const leadingCall = (0, react_1.useRef)(false);
    const functionTimeoutHandler = (0, react_1.useRef)(null);
    const isComponentUnmounted = (0, react_1.useRef)(false);
    const debouncedFunction = (0, react_1.useRef)(callback);
    debouncedFunction.current = callback;
    const cancelDebouncedCallback = (0, react_1.useCallback)(() => {
        clearTimeout(functionTimeoutHandler.current);
        clearTimeout(maxWaitHandler.current);
        maxWaitHandler.current = null;
        maxWaitArgs.current = [];
        functionTimeoutHandler.current = null;
        leadingCall.current = false;
    }, []);
    (0, react_1.useEffect)(() => () => {
        // we use flag, as we allow to call callPending outside the hook
        isComponentUnmounted.current = true;
    }, []);
    const debouncedCallback = (0, react_1.useCallback)((...args) => {
        maxWaitArgs.current = args;
        clearTimeout(functionTimeoutHandler.current);
        if (leadingCall.current) {
            leadingCall.current = false;
        }
        if (!functionTimeoutHandler.current && leading && !leadingCall.current) {
            debouncedFunction.current(...args);
            leadingCall.current = true;
        }
        functionTimeoutHandler.current = setTimeout(() => {
            let shouldCallFunction = true;
            if (leading && leadingCall.current) {
                shouldCallFunction = false;
            }
            cancelDebouncedCallback();
            if (!isComponentUnmounted.current && trailing && shouldCallFunction) {
                debouncedFunction.current(...args);
            }
        }, delay);
        if (maxWait && !maxWaitHandler.current && trailing) {
            maxWaitHandler.current = setTimeout(() => {
                const waitArgs = maxWaitArgs.current;
                cancelDebouncedCallback();
                if (!isComponentUnmounted.current) {
                    debouncedFunction.current.apply(null, waitArgs);
                }
            }, maxWait);
        }
    }, [maxWait, delay, cancelDebouncedCallback, leading, trailing]);
    const callPending = () => {
        // Call pending callback only if we have anything in our queue
        if (!functionTimeoutHandler.current) {
            return;
        }
        debouncedFunction.current.apply(null, maxWaitArgs.current);
        cancelDebouncedCallback();
    };
    // At the moment, we use 3 args array so that we save backward compatibility
    return [debouncedCallback, cancelDebouncedCallback, callPending];
}
//# sourceMappingURL=useDebouncedCallback.js.map