"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerticalSelectBox = void 0;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const react_native_1 = require("react-native");
const Icon_1 = require("./Icon");
const index_1 = require("../../assets/index");
const Text_1 = require("./Text");
const IconButton_1 = require("./buttons/IconButton");
const ThemedModal_1 = require("./ThemedModal");
const VerticalSelectBox = ({ items, onValueChange, hasError = false, containerStyle = null, itemStyle = null, height = 45, buttonStyle = null, maxLength = 20, errorHeading = 'none', errorContent = 'none', }) => {
    const [position] = react_1.default.useState(new react_native_1.Animated.Value(0));
    const [isStateOne, setIsStateOne] = react_1.default.useState(true);
    const [i, setI] = react_1.default.useState(0);
    const [j, setJ] = react_1.default.useState(1);
    const [positionNext] = react_1.default.useState(new react_native_1.Animated.Value(0));
    const [isEnabled, setIsEnabled] = react_1.default.useState(true);
    const [isVisible, setIsVisible] = react_1.default.useState(false);
    const Animate = () => {
        setIsEnabled(false);
        react_native_1.Animated.sequence([
            react_native_1.Animated.parallel([
                react_native_1.Animated.timing(position, {
                    duration: 500,
                    useNativeDriver: true,
                    toValue: isStateOne ? -height : 0,
                }),
                react_native_1.Animated.timing(positionNext, {
                    duration: 500,
                    useNativeDriver: true,
                    toValue: isStateOne ? -height : -2 * height,
                }),
            ]),
            react_native_1.Animated.timing(isStateOne ? position : positionNext, {
                toValue: isStateOne ? height : 0,
                useNativeDriver: true,
                duration: 0,
            }),
        ]).start(() => {
            setIsEnabled(true);
            isStateOne
                ? setI(() => {
                    if (j + 1 > items.length - 1) {
                        return 0;
                    }
                    return j + 1;
                })
                : setJ(() => {
                    if (i + 1 > items.length - 1) {
                        return 0;
                    }
                    return i + 1;
                });
            isStateOne ? onValueChange(items[j]) : onValueChange(items[i]);
            setIsStateOne((val) => !val);
        });
    };
    return (<>
      <FormControl style={Object.assign({ height }, containerStyle)}>
        <Row disabled={!isEnabled} onPress={() => Animate()} style={{ height, overflow: 'hidden' }}>
          <react_native_1.Animated.View style={{
            height,
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ translateY: position }],
        }}>
            <SelectedItem style={[itemStyle, i === 0 ? { color: '#28b9cb' } : { color: '#555' }]}>
              {items[i] === ''
            ? ''
            : items[i].length > maxLength
                ? items[i].substring(0, maxLength - 3) + '...'
                : items[i]}
            </SelectedItem>
          </react_native_1.Animated.View>
          <react_native_1.Animated.View style={{
            height,
            alignItems: 'center',
            justifyContent: 'center',
            transform: [{ translateY: positionNext }],
        }}>
            <SelectedItem style={[itemStyle, j === 0 ? { color: '#28b9cb' } : { color: '#555' }]}>
              {items[j] === ''
            ? ''
            : items[j].length > maxLength
                ? items[j].substring(0, maxLength - 3) + '...'
                : items[j]}
            </SelectedItem>
          </react_native_1.Animated.View>
        </Row>
        {hasError && (<react_native_1.TouchableOpacity style={{
                height: '90%',
                aspectRatio: 1,
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 5,
                zIndex: 999,
                bottom: '5%',
            }} onPress={() => setIsVisible(true)}>
            <Icon_1.Icon style={{ height: 25, aspectRatio: 1 }} source={index_1.assets.static.icons.infoPink}/>
          </react_native_1.TouchableOpacity>)}
        <AbsolutePositioner style={[buttonStyle, buttonStyle]}>
          <IconButton_1.IconButton disabled={!isEnabled} style={{ transform: [{ rotate: '-90deg' }] }} onPress={() => Animate()} name="switch"/>
        </AbsolutePositioner>
      </FormControl>
      <ThemedModal_1.ThemedModal {...{ isVisible, setIsVisible }}>
        <CardPicker>
          <Heading>{errorHeading}</Heading>
          <TextContent>{errorContent}</TextContent>
        </CardPicker>
      </ThemedModal_1.ThemedModal>
    </>);
};
exports.VerticalSelectBox = VerticalSelectBox;
const FormControl = native_1.default.View `
  width: 100%;
  background-color: #efefef;
`;
const Row = native_1.default.TouchableOpacity `
  width: 100%;
  flex-direction: column;
`;
const AbsolutePositioner = native_1.default.View `
  position: absolute;
  right: -40;
  bottom: 5;
`;
const SelectedItem = (0, native_1.default)(Text_1.Text) `
  justify-content: center;
  font-family: Roboto-Regular;
  text-align: center;
  font-size: 15;
`;
const CardPicker = native_1.default.View `
  width: 95%;
  background-color: #fff;
  border-radius: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: center;
  padding-vertical: 15;
  padding-horizontal: 15;
`;
const Heading = (0, native_1.default)(Text_1.Text) `
  font-family: Roboto-Black;
  font-size: 18;
  margin-bottom: 10;
  color: #a2c72d;
`;
const TextContent = (0, native_1.default)(Text_1.Text) `
  font-family: Roboto-Regular;
  font-size: 16;
  margin-bottom: 10;
`;
//# sourceMappingURL=VerticalSelectBox.jsx.map