"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeartAnimation = HeartAnimation;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const index_1 = require("../../../assets/index");
function HeartAnimation({ count }) {
    const [hearts, setHearts] = react_1.default.useState([]);
    const [height] = react_1.default.useState(200);
    const oldCount = react_1.default.useRef(0);
    const heartId = react_1.default.useRef(0);
    function createHeart(index) {
        return {
            id: index,
            left: getRandomNumber(0, 50),
        };
    }
    function removeHeart(id) {
        setHearts(heartsCurrent => heartsCurrent.filter(heart => heart.id !== id));
    }
    react_1.default.useEffect(() => {
        const newCount = count;
        const numHearts = newCount - oldCount.current;
        if (numHearts <= 0) {
            return;
        }
        const items = Array(numHearts).fill(0);
        heartId.current = heartId.current + 1;
        const newHearts = items.map(() => heartId.current).map(createHeart);
        oldCount.current = count;
        setHearts(heartsCurrent => heartsCurrent.concat(newHearts));
    }, [count]);
    return (<react_native_1.View style={react_native_1.StyleSheet.absoluteFill} pointerEvents="none">
      {hearts.map(({ id, left }) => (<AnimatedShape key={id} height={height} style={{ left }} onComplete={() => removeHeart(id)}>
          <react_native_1.Image source={index_1.assets.static.icons.heart.full} style={{ height: 30, width: 30 }}/>
        </AnimatedShape>))}
    </react_native_1.View>);
}
function AnimatedShape({ height, onComplete, children, style }) {
    const [position] = react_1.default.useState(new react_native_1.Animated.Value(0));
    const [animationsReady, setAnimationsReady] = react_1.default.useState(false);
    const xAnimation = react_1.default.useRef();
    const yAnimation = react_1.default.useRef();
    const scaleAnimation = react_1.default.useRef();
    const rotateAnimation = react_1.default.useRef();
    const opacityAnimation = react_1.default.useRef();
    react_1.default.useEffect(() => {
        react_native_1.Animated.timing(position, {
            duration: 1500,
            useNativeDriver: true,
            toValue: height * -1,
        }).start(onComplete);
    }, []);
    function getAnimationStyle() {
        if (!animationsReady) {
            return { opacity: 0 };
        }
        return {
            transform: [
                { translateY: position },
                { translateX: xAnimation.current },
                { scale: scaleAnimation.current },
                { rotate: rotateAnimation.current },
            ],
            opacity: opacityAnimation.current,
        };
    }
    const handleOnLayout = e => {
        const negativeHeight = height * -1;
        const shapeHeight = e.nativeEvent.layout.height;
        yAnimation.current = position.interpolate({
            inputRange: [negativeHeight, 0],
            outputRange: [height, 0],
        });
        opacityAnimation.current = yAnimation.current.interpolate({
            inputRange: [0, height - shapeHeight],
            outputRange: [1, 0],
        });
        scaleAnimation.current = yAnimation.current.interpolate({
            inputRange: [0, 15, 30, height],
            outputRange: [0, 1.2, 1, 1],
        });
        xAnimation.current = yAnimation.current.interpolate({
            inputRange: [0, height / 2, height],
            outputRange: [0, 15, 0],
        });
        rotateAnimation.current = yAnimation.current.interpolate({
            inputRange: [0, height / 4, height / 3, height / 2, height],
            outputRange: ['0deg', '-2deg', '0deg', '2deg', '0deg'],
        });
        setTimeout(() => setAnimationsReady(true), 400);
    };
    return (<react_native_1.Animated.View style={[
            {
                position: 'absolute',
                bottom: 0,
                backgroundColor: 'transparent',
            },
            getAnimationStyle(),
            style,
        ]} onLayout={handleOnLayout}>
      {children}
    </react_native_1.Animated.View>);
}
const getRandomNumber = (min, max) => Math.random() * (max - min) + min;
//# sourceMappingURL=HeartAnimation.jsx.map