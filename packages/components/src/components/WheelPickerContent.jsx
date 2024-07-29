"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WheelPickerContent = void 0;
const react_1 = __importDefault(require("react"));
const react_native_wheel_picker_android_1 = require("react-native-wheel-picker-android");
const i18n_1 = require("../i18n");
const react_native_1 = require("react-native");
const picker_1 = require("@react-native-picker/picker");
const WheelPickerContent = ({ optionsRange, optionsUnit, setQuestionAnswer, answersData, questionAnswer, id, }) => {
    return (<>
      {react_native_1.Platform.OS === 'ios' ? (<picker_1.Picker style={{
                width: 300,
                height: 200,
                marginTop: 'auto',
                marginBottom: 'auto',
            }} selectedValue={(questionAnswer + 1).toString()} onValueChange={(itemValue, itemIndex) => {
                setQuestionAnswer({
                    data: answersData.data.map((item) => item.id === id ? Object.assign(Object.assign({}, item), { answer: itemIndex }) : item),
                });
            }}>
          {optionsRange.map((item, index) => (<picker_1.Picker.Item label={`${item} ${item === 1 ? (0, i18n_1.translate)(optionsUnit[0]) : (0, i18n_1.translate)(optionsUnit[1])}`} value={`${item}`} key={index}/>))}
        </picker_1.Picker>) : (<react_native_wheel_picker_android_1.WheelPicker style={{
                marginTop: 'auto',
                marginBottom: 'auto',
                width: 300,
                height: 200,
            }} itemTextSize={18} selectedItemTextSize={18} 
        // @ts-ignore
        itemStyle={{ height: react_native_1.Platform.OS === 'ios' ? 150 : 50 }} selectedItem={questionAnswer} data={optionsRange.map((option) => `${option} ${option === 1 ? (0, i18n_1.translate)(optionsUnit[0]) : (0, i18n_1.translate)(optionsUnit[1])}`)} onTouchStart={() => false} onItemSelected={(index) => {
                setQuestionAnswer({
                    data: answersData.data.map((item) => item.id === id ? Object.assign(Object.assign({}, item), { answer: index }) : item),
                });
            }}/>)}
    </>);
};
exports.WheelPickerContent = WheelPickerContent;
//# sourceMappingURL=WheelPickerContent.jsx.map