"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.logLikeMetro = logLikeMetro;
exports.formatStackLikeMetro = formatStackLikeMetro;
exports.augmentLogs = void 0;
var _metroConfig = require("@expo/metro-config");
var _chalk = _interopRequireDefault(require("chalk"));
var _path = _interopRequireDefault(require("path"));
var stackTraceParser = _interopRequireWildcard(require("stacktrace-parser"));
var _env = require("../../utils/env");
var _fn = require("../../utils/fn");
function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
        return obj;
    } else {
        var newObj = {};
        if (obj != null) {
            for(var key in obj){
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {};
                    if (desc.get || desc.set) {
                        Object.defineProperty(newObj, key, desc);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
        }
        newObj.default = obj;
        return newObj;
    }
}
const groupStack = [];
let collapsedGuardTimer;
function logLikeMetro(originalLogFunction, level, platform, ...data) {
    // @ts-expect-error
    const logFunction = console[level] && level !== "trace" ? level : "log";
    const color = level === "error" ? _chalk.default.inverse.red : level === "warn" ? _chalk.default.inverse.yellow : _chalk.default.inverse.white;
    if (level === "group") {
        groupStack.push(level);
    } else if (level === "groupCollapsed") {
        groupStack.push(level);
        clearTimeout(collapsedGuardTimer);
        // Inform users that logs get swallowed if they forget to call `groupEnd`.
        collapsedGuardTimer = setTimeout(()=>{
            if (groupStack.includes("groupCollapsed")) {
                originalLogFunction(_chalk.default.inverse.yellow.bold(" WARN "), "Expected `console.groupEnd` to be called after `console.groupCollapsed`.");
                groupStack.length = 0;
            }
        }, 3000);
        return;
    } else if (level === "groupEnd") {
        groupStack.pop();
        if (!groupStack.length) {
            clearTimeout(collapsedGuardTimer);
        }
        return;
    }
    if (!groupStack.includes("groupCollapsed")) {
        // Remove excess whitespace at the end of a log message, if possible.
        const lastItem = data[data.length - 1];
        if (typeof lastItem === "string") {
            data[data.length - 1] = lastItem.trimEnd();
        }
        const modePrefix = _chalk.default.bold`${platform}`;
        originalLogFunction(modePrefix + " " + color.bold(` ${logFunction.toUpperCase()} `) + "".padEnd(groupStack.length * 2, " "), ...data);
    }
}
const escapedPathSep = _path.default.sep === "\\" ? "\\\\" : _path.default.sep;
const SERVER_STACK_MATCHER = new RegExp(`${escapedPathSep}(react-dom|metro-runtime|expo-router)${escapedPathSep}`);
function augmentLogsInternal(projectRoot) {
    const augmentLog = (name, fn)=>{
        // @ts-expect-error: TypeScript doesn't know about polyfilled functions.
        if (fn.__polyfilled) {
            return fn;
        }
        const originalFn = fn.bind(console);
        function logWithStack(...args) {
            const stack = new Error().stack;
            // Check if the log originates from the server.
            const isServerLog = !!(stack == null ? void 0 : stack.match(SERVER_STACK_MATCHER));
            if (isServerLog) {
                if (name === "error" || name === "warn") {
                    args.push("\n" + formatStackLikeMetro(projectRoot, stack));
                }
                logLikeMetro(originalFn, name, "\u03BB", ...args);
            } else {
                originalFn(...args);
            }
        }
        logWithStack.__polyfilled = true;
        return logWithStack;
    };
    [
        "trace",
        "info",
        "error",
        "warn",
        "log",
        "group",
        "groupCollapsed",
        "groupEnd",
        "debug"
    ].forEach((name)=>{
        // @ts-expect-error
        console[name] = augmentLog(name, console[name]);
    });
}
function formatStackLikeMetro(projectRoot, stack) {
    // Remove `Error: ` from the beginning of the stack trace.
    // Dim traces that match `INTERNAL_CALLSITES_REGEX`
    const stackTrace = stackTraceParser.parse(stack);
    return stackTrace.filter((line)=>line.file && line.file !== "<anonymous>" && // Ignore unsymbolicated stack frames. It's not clear how this is possible but it sometimes happens when the graph changes.
        !/^https?:\/\//.test(line.file)
    ).map((line)=>{
        // Use the same regex we use in Metro config to filter out traces:
        const isCollapsed = _metroConfig.INTERNAL_CALLSITES_REGEX.test(line.file);
        if (isCollapsed && !_env.env.EXPO_DEBUG) {
            return null;
        }
        // If a file is collapsed, print it with dim styling.
        const style = isCollapsed ? _chalk.default.dim : _chalk.default.gray;
        // Use the `at` prefix to match Node.js
        let fileName = line.file;
        if (fileName.startsWith(_path.default.sep)) {
            fileName = _path.default.relative(projectRoot, fileName);
        }
        if (line.lineNumber != null) {
            fileName += `:${line.lineNumber}`;
            if (line.column != null) {
                fileName += `:${line.column}`;
            }
        }
        return style(`  ${line.methodName} (${fileName})`);
    }).filter(Boolean).join("\n");
}
const augmentLogs = (0, _fn).memoize(augmentLogsInternal);
exports.augmentLogs = augmentLogs;

//# sourceMappingURL=serverLogLikeMetro.js.map