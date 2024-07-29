"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useRandomText = useRandomText;
const react_1 = __importDefault(require("react"));
const DisplayTextContext_1 = require("../components/context/DisplayTextContext");
function useRandomText({ navigation }) {
    const { setDisplayTextRandom } = (0, DisplayTextContext_1.useDisplayText)();
    const [shouldDisplayText, setShouldDisplayText] = react_1.default.useState(false);
    react_1.default.useEffect(() => {
        const screenFocus = navigation.addListener('didFocus', () => {
            setShouldDisplayText(true);
        });
        const screenWillBlur = navigation.addListener('willBlur', () => {
            setShouldDisplayText(false);
        });
        return () => {
            screenFocus.remove();
            screenWillBlur.remove();
            setShouldDisplayText(false);
        };
    }, []);
    react_1.default.useEffect(() => {
        let intervalId;
        if (shouldDisplayText) {
            intervalId = setInterval(setDisplayTextRandom, 20000);
        }
        return () => {
            clearTimeout(intervalId);
        };
    }, [shouldDisplayText]);
}
//# sourceMappingURL=useRandomText.js.map