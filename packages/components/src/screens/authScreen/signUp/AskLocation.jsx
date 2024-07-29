"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AskLocation = AskLocation;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const SignUpFormLayout_1 = require("./SignUpFormLayout");
const MultiStepForm_1 = require("../../../components/common/MultiStepForm");
const Text_1 = require("../../../components/common/Text");
const SegmentControl_1 = require("../../../components/common/SegmentControl");
const FormHeights_1 = require("./FormHeights");
const ModalSearchBox_1 = require("../../../components/common/ModalSearchBox");
const useSelector_1 = require("../../../hooks/useSelector");
const selectors = __importStar(require("../../../redux/selectors"));
const i18n_1 = require("../../../i18n");
const config_1 = require("../../../config");
function AskLocation({ step, createAccount }) {
    const [{ app: state }, dispatch] = (0, MultiStepForm_1.useMultiStepForm)();
    const lang = (0, useSelector_1.useSelector)(selectors.currentLocaleSelector);
    const { country, province, location } = state;
    const [derivedCountry, setDerivedCountry] = react_1.default.useState(config_1.FAST_SIGN_UP ? { code: 'AF', item: 'Afghanistan' } : null);
    const [derivedProvince, setDerivedProvince] = react_1.default.useState(config_1.FAST_SIGN_UP ? { code: '15', item: 'Ghazni' } : null);
    const [notValid, setNotValid] = react_1.default.useState(false);
    react_1.default.useEffect(() => {
        if (derivedCountry !== null && derivedCountry.code !== country) {
            dispatch({ type: 'change-form-data', inputName: 'country', value: derivedCountry.code });
            return;
        }
        if (derivedProvince !== null && derivedProvince.code !== province) {
            dispatch({ type: 'change-form-data', inputName: 'province', value: derivedProvince.code });
            return;
        }
    }, [derivedCountry, derivedProvince]);
    function checkValidity() {
        return location.length >= 4 && derivedProvince !== null && derivedCountry !== null;
    }
    const locations = ['Urban', 'Rural'];
    return (<SignUpFormLayout_1.SignUpFormLayout onSubmit={() => {
            if (!checkValidity()) {
                setNotValid(true);
                return;
            }
            createAccount(state);
        }}>
      <Container style={{
            height: FormHeights_1.formHeights.askLocation,
            paddingHorizontal: 15,
            elevation: 4,
            backgroundColor: 'white',
            overflow: 'hidden',
        }}>
        <ModalSearchBox_1.ModalSearchBox isValid={derivedCountry !== null} hasError={notValid && derivedCountry === null} lang={lang} containerStyle={{
            height: 45,
            borderRadius: 22.5,
            marginBottom: 10,
        }} location={derivedCountry} onSelection={setDerivedCountry} height={45} buttonStyle={{ right: 5, bottom: 7 }} searchInputPlaceholder={`search_country`} accessibilityLabel={(0, i18n_1.translate)('search_country')}/>
        <ModalSearchBox_1.ModalSearchBox isValid={derivedProvince !== null} hasError={notValid && derivedProvince === null} containerStyle={{
            height: 45,
            borderRadius: 22.5,
            marginBottom: 10,
        }} lang={lang} isCountrySelector={false} filterCountry={derivedCountry} location={derivedProvince} onSelection={setDerivedProvince} height={45} buttonStyle={{ right: 5, bottom: 7 }} searchInputPlaceholder={`search_province`}/>
        <LocationText>location</LocationText>
        <Row>
          {locations.map((value) => {
            return (<SegmentControl_1.SegmentControl key={value} option={value} isActive={location === value} onPress={() => dispatch({ type: 'change-form-data', inputName: 'location', value })}/>);
        })}
        </Row>
      </Container>
    </SignUpFormLayout_1.SignUpFormLayout>);
}
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
const Row = native_1.default.View `
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: 10;
`;
//# sourceMappingURL=AskLocation.jsx.map