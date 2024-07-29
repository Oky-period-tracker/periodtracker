"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwiperContainer = void 0;
const react_1 = __importDefault(require("react"));
const react_native_swiper_1 = __importDefault(require("react-native-swiper"));
const react_native_1 = require("react-native");
exports.SwiperContainer = react_1.default.forwardRef(({ children, style = {}, scrollEnabled = null, pagingEnabled = null, setIndex = _ => null, onIndexChange = () => null, }, ref) => {
    return (<react_native_swiper_1.default style={Object.assign({}, style)} showsButtons={false} scrollEnabled={scrollEnabled || false} pagingEnabled={pagingEnabled || false} removeClippedSubviews={false} loop={false} onIndexChanged={ind => {
            onIndexChange();
            setIndex(ind);
        }} dotColor={'#efefef'} activeDotColor={'#f9c7c1'} dotStyle={{
            width: 18,
            height: 18,
            borderRadius: 10,
            marginBottom: react_native_1.Platform.OS === 'ios' ? 10 : 20,
            elevation: 2,
        }} activeDotStyle={{
            width: 18,
            height: 18,
            borderRadius: 10,
            elevation: 6,
            marginBottom: react_native_1.Platform.OS === 'ios' ? 10 : 20,
        }} ref={ref}>
        {children}
      </react_native_swiper_1.default>);
});
//# sourceMappingURL=SwiperContainer.jsx.map