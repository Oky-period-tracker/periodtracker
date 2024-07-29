"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectBox = void 0;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const react_native_1 = require("react-native");
const Icon_1 = require("./Icon");
const index_1 = require("../../assets/index");
const Text_1 = require("./Text");
const IconButton_1 = require("./buttons/IconButton");
const SelectBox = ({ items, onValueChange, title, hasError = false, isValid = false, containerStyle = null, itemStyle = null, width = 150, buttonStyle = null, maxLength = 20, }) => {
    const [position] = react_1.default.useState(new react_native_1.Animated.Value(0));
    const [isStateOne, setIsStateOne] = react_1.default.useState(true);
    const [i, setI] = react_1.default.useState(0);
    const [j, setJ] = react_1.default.useState(1);
    const [positionNext] = react_1.default.useState(new react_native_1.Animated.Value(0));
    const Animate = () => {
        react_native_1.Animated.sequence([
            react_native_1.Animated.parallel([
                react_native_1.Animated.timing(position, {
                    duration: 500,
                    useNativeDriver: true,
                    toValue: isStateOne ? -width : 0,
                }),
                react_native_1.Animated.timing(positionNext, {
                    duration: 500,
                    useNativeDriver: true,
                    toValue: isStateOne ? -width : -2 * width,
                }),
            ]),
            react_native_1.Animated.timing(isStateOne ? position : positionNext, {
                toValue: isStateOne ? width : 0,
                useNativeDriver: true,
                duration: 0,
            }),
        ]).start(() => {
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
    return (<FormControl style={Object.assign({ width }, containerStyle)}>
      <Label>{title}</Label>
      <Row onPress={() => Animate()} style={{ overflow: 'hidden' }}>
        <react_native_1.Animated.View style={{ width, transform: [{ translateX: position }] }}>
          <SelectedItem style={itemStyle}>
            {items[i] === ''
            ? ''
            : items[i].length > maxLength
                ? items[i].substring(0, maxLength - 3) + '...'
                : items[i]}
          </SelectedItem>
        </react_native_1.Animated.View>
        <react_native_1.Animated.View style={{ width, transform: [{ translateX: positionNext }] }}>
          <SelectedItem style={itemStyle}>
            {items[j] === ''
            ? ''
            : items[j].length > maxLength
                ? items[j].substring(0, maxLength - 3) + '...'
                : items[j]}
          </SelectedItem>
        </react_native_1.Animated.View>
      </Row>
      {isValid && !hasError && (<Icon_1.Icon source={index_1.assets.static.icons.tick} style={{ position: 'absolute', right: 0, bottom: 5 }}/>)}
      {hasError && (<Icon_1.Icon source={index_1.assets.static.icons.closeLine} style={{ position: 'absolute', right: 0, bottom: 5 }}/>)}
      <Underline />
      <AbsolutePositioner style={buttonStyle}>
        <IconButton_1.IconButton onPress={() => Animate()} name="switch"/>
      </AbsolutePositioner>
    </FormControl>);
};
exports.SelectBox = SelectBox;
const FormControl = native_1.default.View `
  width: 150;
`;
const Row = native_1.default.TouchableOpacity `
  width: 100%;
  flex-direction: row;
`;
const AbsolutePositioner = native_1.default.View `
  position: absolute;
  right: 0;
  bottom: 5;
`;
const Label = (0, native_1.default)(Text_1.Text) `
  width: 100%;
  color: #28b9cb;
  font-size: 12;
`;
const Underline = native_1.default.View `
  height: 1px;
  background: #eaeaea;
  width: 100%;
`;
const SelectedItem = (0, native_1.default)(Text_1.Text) `
  height: 25px;
  width: 100%;
  font-size: 18;
  color: #555;
`;
//# sourceMappingURL=SelectBox.jsx.map