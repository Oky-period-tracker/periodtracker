"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useOrientation = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
/**
 * Detects the orientation of the device, causes re-render on orientation change
 */
const useOrientation = () => {
    const [orientation, setOrientation] = react_1.default.useState(getOrientation());
    react_1.default.useEffect(() => {
        const subscription = react_native_1.Dimensions.addEventListener('change', ({ window: { width, height } }) => {
            const currentOrientation = width < height ? 'PORTRAIT' : 'LANDSCAPE';
            setOrientation(currentOrientation);
        });
        return () => subscription.remove();
    }, []);
    return orientation;
};
exports.useOrientation = useOrientation;
function getOrientation() {
    const { width, height } = react_native_1.Dimensions.get('window');
    return width < height ? 'PORTRAIT' : 'LANDSCAPE';
}
//# sourceMappingURL=useOrientation.js.map