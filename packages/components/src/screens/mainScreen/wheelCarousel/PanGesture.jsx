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
exports.PanGesture = PanGesture;
const React = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_reanimated_1 = __importDefault(require("react-native-reanimated"));
const react_native_gesture_handler_1 = require("react-native-gesture-handler");
const react_native_redash_1 = require("react-native-redash");
const { Clock, Value, useCode, set, divide, diff, sub, block, eq, cond, floor, ceil, not, clockRunning, stopClock, multiply, and, } = react_native_reanimated_1.default;
const springConfig = {
    toValue: new Value(0),
    damping: 15,
    mass: 1,
    stiffness: 150,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
};
function PanGesture({ absoluteIndex, ratio, isActive, isX, children = null }) {
    const clock = new Clock();
    const shouldSnap = new Value(0);
    const translationY = new Value(0);
    const velocityY = new Value(0);
    const translationX = new Value(0);
    const velocityX = new Value(0);
    const state = new Value(react_native_gesture_handler_1.State.UNDETERMINED);
    const gestureEvent = (0, react_native_redash_1.onGestureEvent)({
        translationY,
        velocityY,
        translationX,
        velocityX,
        state,
    });
    const translate = isX
        ? (0, react_native_redash_1.preserveOffset)(translationX, state)
        : (0, react_native_redash_1.preserveOffset)(multiply(translationY, new Value(-1)), state); // Added inversion to the y translate (multiply multiplies 2 animated Values together)
    const increment = divide(diff(translate), ratio);
    const velocity = isX ? velocityX : velocityY;
    useCode(block([
        set(absoluteIndex, sub(absoluteIndex, increment)),
        cond(and(eq(state, react_native_gesture_handler_1.State.BEGAN), eq(shouldSnap, 1)), [
            stopClock(clock),
            set(isActive, 0),
            set(shouldSnap, 0),
        ]),
        cond(eq(state, react_native_gesture_handler_1.State.BEGAN), [stopClock(clock), set(isActive, 1)]),
        cond(eq(state, react_native_gesture_handler_1.State.END), [set(state, react_native_gesture_handler_1.State.UNDETERMINED), set(shouldSnap, 1)]),
        cond(eq(shouldSnap, 1), [
            set(absoluteIndex, (0, react_native_redash_1.runSpring)(clock, absoluteIndex, (0, react_native_redash_1.snapPoint)(absoluteIndex, divide(velocity, -ratio), [
                ceil(absoluteIndex),
                floor(absoluteIndex),
            ]), springConfig)),
            cond(not(clockRunning(clock)), [set(shouldSnap, 0), set(isActive, 0)]),
        ]),
    ]), []);
    return (<react_native_gesture_handler_1.PanGestureHandler {...gestureEvent} minDist={15} {...children}>
      <react_native_reanimated_1.default.View style={react_native_1.StyleSheet.absoluteFillObject}>{children}</react_native_reanimated_1.default.View>
    </react_native_gesture_handler_1.PanGestureHandler>);
}
//# sourceMappingURL=PanGesture.jsx.map