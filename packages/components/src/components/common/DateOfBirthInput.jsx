"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateOfBirthInput = DateOfBirthInput;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const react_native_wheel_picker_android_1 = require("react-native-wheel-picker-android");
const moment_1 = __importDefault(require("moment"));
const lodash_1 = __importDefault(require("lodash"));
const Text_1 = require("./Text");
const ThemedModal_1 = require("./ThemedModal");
const i18n_1 = require("../../i18n");
const react_native_1 = require("react-native");
const picker_1 = require("@react-native-picker/picker");
const now = (0, moment_1.default)();
const currentYear = now.year();
const currentMonth = now.month();
const monthRange = moment_1.default.months();
const yearRange = lodash_1.default.range(currentYear, currentYear - 100).map(String);
function DateOfBirthInput({ style, textStyle = null, label, onChange, value }) {
    const dateOfBirth = value && (0, moment_1.default)(value);
    const selectedMonth = dateOfBirth ? dateOfBirth.month() : currentMonth;
    const selectedYear = dateOfBirth ? currentYear - dateOfBirth.year() : currentYear - 13;
    const [isVisible, setIsVisible] = react_1.default.useState(false);
    const [monthSelected, setMonthSelected] = react_1.default.useState('');
    const [yearSelected, setYearSelected] = react_1.default.useState('');
    return (<>
      <FormControl style={style}>
        <Label>{label}</Label>
        <Input onPress={() => setIsVisible(true)}>
          <InputValue style={textStyle}>
            {dateOfBirth && (0, i18n_1.translate)(dateOfBirth.format('MMM')) + ' ' + dateOfBirth.format('YYYY')}
          </InputValue>
        </Input>
        <Underline />
      </FormControl>
      <ThemedModal_1.ThemedModal {...{ isVisible, setIsVisible }}>
        <CardPicker>
          {react_native_1.Platform.OS === 'ios' ? (<Column>
              <picker_1.Picker style={{ width: '50%', height: 200, marginBottom: 20 }} selectedValue={monthSelected || monthRange[selectedMonth]} onValueChange={(itemValue, itemIndex) => setMonthSelected(monthRange[itemIndex])}>
                {monthRange.map((item, index) => (<picker_1.Picker.Item label={`${(0, i18n_1.translate)(item)}`} value={`${(0, i18n_1.translate)(item)}`} key={index}/>))}
              </picker_1.Picker>
              <picker_1.Picker style={{ width: '50%', height: 200, marginBottom: 20 }} selectedValue={yearSelected || yearRange[selectedYear]} onValueChange={(itemValue, itemIndex) => setYearSelected(yearRange[itemIndex])}>
                {yearRange.map((item, index) => (<picker_1.Picker.Item label={item} value={item} key={index}/>))}
              </picker_1.Picker>
            </Column>) : (<Column>
              <react_native_wheel_picker_android_1.WheelPicker style={{ width: '50%', height: 200 }} 
        // @ts-ignore
        itemStyle={{ height: react_native_1.Platform.OS === 'ios' ? 132 : 44 }} selectedItem={selectedMonth} data={monthRange.map((item) => `${(0, i18n_1.translate)(item)}`)} onItemSelected={(option) => setMonthSelected(monthRange[option])}/>
              <react_native_wheel_picker_android_1.WheelPicker style={{ width: '50%', height: 200 }} 
        // @ts-ignore
        itemStyle={{ height: react_native_1.Platform.OS === 'ios' ? 132 : 44 }} selectedItem={selectedYear} data={yearRange} onItemSelected={(option) => setYearSelected(yearRange[option])}/>
            </Column>)}
          <Confirm onPress={() => {
            onChange((0, moment_1.default)(monthSelected + ' ' + yearSelected, 'MMMM YYYY').toISOString());
            setIsVisible(false);
        }}>
            <ConfirmText>confirm</ConfirmText>
          </Confirm>
        </CardPicker>
      </ThemedModal_1.ThemedModal>
    </>);
}
const Column = native_1.default.View `
  flex-direction: row;
  width: 100%;
`;
const FormControl = native_1.default.View `
  width: 150;
  margin-bottom: 10;
`;
const Label = (0, native_1.default)(Text_1.Text) `
  color: #28b9cb;
  width: 150;
  font-size: 12;
`;
const Input = native_1.default.TouchableOpacity `
  width: 100%;
  height: 25px;
`;
const InputValue = (0, native_1.default)(Text_1.TextWithoutTranslation) `
  font-size: 16;
`;
const Underline = native_1.default.View `
  height: 1px;
  width: 100%;
  background: #eaeaea;
`;
const Confirm = native_1.default.TouchableOpacity `
  width: 200px;
  height: 45px;
  border-radius: 22.5px;
  background-color: #a2c72d;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  margin-top: 10px;
`;
const CardPicker = native_1.default.View `
  width: 85%;
  height: 400px;
  background-color: #fff;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  align-self: center;
`;
const ConfirmText = (0, native_1.default)(Text_1.Text) `
  font-family: Roboto-Black;
  font-size: 14;
  color: #fff;
`;
//# sourceMappingURL=DateOfBirthInput.jsx.map