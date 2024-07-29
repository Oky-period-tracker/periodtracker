"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useKeyboardController = useKeyboardController;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
function useKeyboardController() {
    const [keyboardIsOpen, setKeyboardIsOpen] = react_1.default.useState(false);
    react_1.default.useEffect(() => {
        const keyboardDidShowListener = react_native_1.Keyboard.addListener('keyboardDidShow', () => setKeyboardIsOpen(true));
        const keyboardDidHideListener = react_native_1.Keyboard.addListener('keyboardDidHide', () => setKeyboardIsOpen(false));
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);
    return {
        keyboardIsOpen,
        dismiss: () => react_native_1.Keyboard.dismiss(),
    };
}
//# sourceMappingURL=useKeyboardController.js.map