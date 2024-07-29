"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskAge = AskAge;
const react_1 = __importDefault(require("react"));
const lodash_1 = __importDefault(require("lodash"));
const native_1 = __importDefault(require("styled-components/native"));
const SignUpFormLayout_1 = require("./SignUpFormLayout");
const MultiStepForm_1 = require("../../../components/common/MultiStepForm");
const react_native_wheel_picker_android_1 = require("react-native-wheel-picker-android");
const Text_1 = require("../../../components/common/Text");
const Icon_1 = require("../../../components/common/Icon");
const index_1 = require("../../../assets/index");
const moment_1 = __importDefault(require("moment"));
const i18n_1 = require("../../../i18n");
const react_native_1 = require("react-native");
const ThemedModal_1 = require("../../../components/common/ThemedModal");
const FormHeights_1 = require("./FormHeights");
const picker_1 = require("@react-native-picker/picker");
const config_1 = require("../../../config");
const now = (0, moment_1.default)();
const currentYear = now.year();
const monthRange = moment_1.default.months();
const yearRange = lodash_1.default.range(currentYear - 7, currentYear - 100).map(String);
function AskAge({ step, heightInner }) {
    const [{ app: state }, dispatch] = (0, MultiStepForm_1.useMultiStepForm)();
    const { location, dateOfBirth } = state;
    const [notValid, setNotValid] = react_1.default.useState(false);
    const [flag, setFlag] = react_1.default.useState(false);
    const [monthSelected, setMonthSelected] = react_1.default.useState(config_1.FAST_SIGN_UP ? 'January' : '');
    const [yearSelected, setYearSelected] = react_1.default.useState(config_1.FAST_SIGN_UP ? '2016' : '');
    const [selectedItem] = react_1.default.useState(0);
    const [isVisible, setIsVisible] = react_1.default.useState(false);
    const [infoDisplay, setInfoDisplay] = react_1.default.useState(false);
    const [loading, setLoading] = react_1.default.useState(false);
    function checkValidity() {
        return location.length >= 4 && dateOfBirth && monthSelected !== '' && yearSelected !== '';
    }
    if (loading) {
        return null;
    }
    return (<SignUpFormLayout_1.SignUpFormLayout onSubmit={() => {
            if (!checkValidity()) {
                setNotValid(true);
                return;
            }
            setLoading(true);
            react_native_1.Animated.timing(heightInner, {
                toValue: FormHeights_1.formHeights.askLocation + FormHeights_1.formHeights.buttonConfirmHeight,
                duration: 350,
                useNativeDriver: false,
            }).start(() => {
                dispatch({ formAction: MultiStepForm_1.formActions.goToStep('ask-location') });
            });
        }}>
      <Container style={{
            height: FormHeights_1.formHeights.askAge,
            paddingHorizontal: 15,
            elevation: 4,
            backgroundColor: 'white',
            overflow: 'hidden',
        }}>
        <AgeContentPicker onPress={() => {
            setFlag(true);
            setIsVisible(true);
        }} isValid={monthSelected !== ''} hasError={monthSelected === '' && notValid}>
          <react_native_1.TouchableOpacity style={{ position: 'absolute', left: 10, bottom: 12.5, elevation: 5, zIndex: 999 }} onPress={() => {
            setInfoDisplay(true);
            setIsVisible(true);
        }}>
            <Icon_1.Icon style={{ height: 25, aspectRatio: 1 }} source={index_1.assets.static.icons.infoPink}/>
          </react_native_1.TouchableOpacity>
          <LocationText>{monthSelected === '' ? 'month_of_birth' : monthSelected}</LocationText>
        </AgeContentPicker>
        <AgeContentPicker onPress={() => {
            setFlag(false);
            setIsVisible(true);
        }} hasError={yearSelected === '' && notValid} isValid={yearSelected !== ''}>
          <react_native_1.TouchableOpacity style={{ position: 'absolute', left: 10, bottom: 12.5, elevation: 5, zIndex: 999 }} onPress={() => {
            setInfoDisplay(true);
            setIsVisible(true);
        }}/>
          <YearText>{yearSelected === '' ? (0, i18n_1.translate)('year_of_birth') : yearSelected}</YearText>
        </AgeContentPicker>
        <ThemedModal_1.ThemedModal isVisible={isVisible} setIsVisible={setIsVisible} onModalHide={() => setInfoDisplay(false)} animationOutTiming={react_native_1.Platform.OS === 'ios' ? 100 : 600}>
          {!infoDisplay && (<CardPicker accessibilityLabel={(0, i18n_1.translate)('month_selector')}>
              {react_native_1.Platform.OS === 'ios' ? (<picker_1.Picker style={{ width: 250, height: 200 }} selectedValue={(flag ? monthSelected : yearSelected) || selectedItem} onValueChange={(itemValue, itemIndex) => {
                    flag
                        ? setMonthSelected(monthRange[itemIndex])
                        : setYearSelected(yearRange[itemIndex]);
                }}>
                  {flag
                    ? monthRange.map((item, index) => (<picker_1.Picker.Item label={`${(0, i18n_1.translate)(item)}`} value={`${(0, i18n_1.translate)(item)}`} key={index}/>))
                    : yearRange.map((item, index) => (<picker_1.Picker.Item label={item} value={item} key={index}/>))}
                </picker_1.Picker>) : (<react_native_wheel_picker_android_1.WheelPicker style={{ width: 250, height: 200 }} 
            // @ts-ignore
            itemStyle={{ height: react_native_1.Platform.OS === 'ios' ? 132 : 44 }} selectedItem={selectedItem} data={flag ? monthRange.map((item) => `${(0, i18n_1.translate)(item)}`) : yearRange} onItemSelected={(option) => flag ? setMonthSelected(monthRange[option]) : setYearSelected(yearRange[option])}/>)}

              <Confirm onPress={() => {
                const month = monthSelected !== null && monthSelected !== void 0 ? monthSelected : monthRange[0];
                const year = yearSelected !== null && yearSelected !== void 0 ? yearSelected : yearRange[0];
                dispatch({
                    type: 'change-form-data',
                    inputName: 'dateOfBirth',
                    value: (0, moment_1.default)(month + ' ' + year, 'MMMM YYYY').toISOString(),
                });
                setIsVisible(false);
            }}>
                <ConfirmText>confirm</ConfirmText>
              </Confirm>
            </CardPicker>)}
          {infoDisplay && (<InfoCardPicker>
              <Heading>birth_info_heading</Heading>
              <TextContent>birth_info</TextContent>
            </InfoCardPicker>)}
        </ThemedModal_1.ThemedModal>
      </Container>
    </SignUpFormLayout_1.SignUpFormLayout>);
}
const AgeContentPicker = ({ onPress, children, isValid, hasError }) => {
    return (<AgePicker onPress={onPress}>
      {children}
      {isValid && !hasError ? (<Icon_1.Icon source={index_1.assets.static.icons.tick} style={{ position: 'absolute', right: 8, bottom: 10 }}/>) : null}
      {hasError ? (<Icon_1.Icon source={index_1.assets.static.icons.closeLine} style={{ position: 'absolute', right: 8, bottom: 10 }}/>) : null}
    </AgePicker>);
};
const Container = native_1.default.View `
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const LocationText = (0, native_1.default)(Text_1.Text) `
  font-family: Roboto-Regular;
  font-size: 14;
  color: #28b9cb;
`;
const YearText = (0, native_1.default)(Text_1.TextWithoutTranslation) `
  font-family: Roboto-Regular;
  font-size: 14;
  color: #28b9cb;
`;
const ConfirmText = (0, native_1.default)(Text_1.Text) `
  font-family: Roboto-Black;
  font-size: 14;
  color: #fff;
`;
const Row = native_1.default.View `
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;
const AgePicker = native_1.default.TouchableOpacity `
  width: 100%;
  height: 45px;
  border-radius: 22.5px;
  background-color: #efefef;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  margin-top: 10px;
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
const InfoCardPicker = native_1.default.View `
  width: 95%;
  background-color: #fff;
  border-radius: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: center;
  padding-vertical: 15px;
  padding-horizontal: 15px;
`;
const Heading = (0, native_1.default)(Text_1.Text) `
  font-family: Roboto-Black;
  font-size: 18;
  margin-bottom: 10px;
  color: #a2c72d;
`;
const TextContent = (0, native_1.default)(Text_1.Text) `
  font-family: Roboto-Regular;
  font-size: 16;
  margin-bottom: 10px;
`;
//# sourceMappingURL=AskAge.jsx.map