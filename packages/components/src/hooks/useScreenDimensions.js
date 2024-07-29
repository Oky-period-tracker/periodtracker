"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useScreenDimensions = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const useScreenDimensions = () => {
    const initialWidth = react_native_1.Dimensions.get('screen').width;
    const initialHeight = react_native_1.Dimensions.get('screen').height;
    const [screenWidth, setWidth] = react_1.default.useState(initialWidth);
    const [screenHeight, setHeight] = react_1.default.useState(initialHeight);
    const handleDimensionsChange = ({ window: { width, height } }) => {
        setWidth(width);
        setHeight(height);
    };
    react_1.default.useEffect(() => {
        const subscription = react_native_1.Dimensions.addEventListener('change', handleDimensionsChange);
        return () => {
            subscription && subscription.remove();
        };
    }, []);
    return { screenWidth, screenHeight };
};
exports.useScreenDimensions = useScreenDimensions;
//# sourceMappingURL=useScreenDimensions.js.map