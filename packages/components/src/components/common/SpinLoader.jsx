"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpinLoader = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const native_1 = __importDefault(require("styled-components/native"));
const ThemedModal_1 = require("./ThemedModal");
const assets_1 = require("../../assets");
const Text_1 = require("./Text");
const SpinLoader = ({ isVisible, setIsVisible, text = 'empty', backdropOpacity = 0.8 }) => {
    const [animatedValue] = react_1.default.useState(new react_native_1.Animated.Value(0));
    const onModalWillShow = () => {
        Spin();
    };
    const Spin = () => {
        react_native_1.Animated.timing(animatedValue, {
            duration: 50000,
            toValue: 36000,
            easing: react_native_1.Easing.linear,
            useNativeDriver: true,
        }).start();
    };
    const rotation = animatedValue.interpolate({
        inputRange: [0, 36000],
        outputRange: ['0deg', '36000deg'],
    });
    return (<ThemedModal_1.ThemedModal {...{
        isVisible,
        setIsVisible,
        backdropOpacity,
        animationIn: 'fadeIn',
        animationOut: 'fadeOut',
        onBackdropPress: () => null,
        onModalWillShow,
        onModalHide: () => animatedValue.stopAnimation(),
        includeCloseButton: false,
    }}>
      <TutorialText>{text}</TutorialText>
      <Face resizeMode="contain" source={assets_1.assets.static.spin_load_face}/>
      <Container style={{
            transform: [{ rotate: rotation }],
        }}>
        <Spinner resizeMode="contain" source={assets_1.assets.static.spin_load_circle}/>
      </Container>
    </ThemedModal_1.ThemedModal>);
};
exports.SpinLoader = SpinLoader;
const Face = native_1.default.Image `
  height: 120px;
  width: 120px;

  align-self: center;
`;
const Spinner = native_1.default.Image `
  height: 123px;
  width: 123px;
`;
const Container = (0, native_1.default)(react_native_1.Animated.View) `
  height: 123px;
  width: 123px;
  position: absolute;
  align-self: center;
`;
const TutorialText = (0, native_1.default)(Text_1.Text) `
  width: 70%;
  color: #f49200;
  align-self: center;
  font-size: 20;
  font-family: Roboto-Black;
  top: 20%;
  text-align: center;
  position: absolute;
`;
//# sourceMappingURL=SpinLoader.jsx.map