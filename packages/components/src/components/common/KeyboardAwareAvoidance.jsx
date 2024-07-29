"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyboardAwareAvoidance = void 0;
const react_1 = __importDefault(require("react"));
const react_native_keyboard_aware_scroll_view_1 = require("react-native-keyboard-aware-scroll-view");
const KeyboardAwareAvoidance = ({ style = null, contentContainerStyle = {}, children }) => {
    return (<react_native_keyboard_aware_scroll_view_1.KeyboardAwareScrollView style={{ flexGrow: null, flexShrink: 1, overflow: 'visible' }} contentContainerStyle={[{ overflow: 'visible' }, contentContainerStyle]} extraScrollHeight={-75} resetScrollToCoords={{ x: 0, y: 0 }} scrollEnabled={true} showsVerticalScrollIndicator={false} viewIsInsideTabBar={false} enableOnAndroid={true}>
      {children}
    </react_native_keyboard_aware_scroll_view_1.KeyboardAwareScrollView>);
};
exports.KeyboardAwareAvoidance = KeyboardAwareAvoidance;
//# sourceMappingURL=KeyboardAwareAvoidance.jsx.map