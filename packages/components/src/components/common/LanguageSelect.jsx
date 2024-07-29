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
exports.LanguageSelect = void 0;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const useSelector_1 = require("../../hooks/useSelector");
const selectors = __importStar(require("../../redux/selectors"));
const actions = __importStar(require("../../redux/actions/index"));
const react_redux_1 = require("react-redux");
const PrimaryButton_1 = require("./buttons/PrimaryButton");
const ThemedModal_1 = require("./ThemedModal");
const Text_1 = require("./Text");
const core_1 = require("@oky/core");
const LanguageSelect = ({ style = null, textStyle = null, onPress = null }) => {
    const [modalVisible, setModalVisible] = react_1.default.useState(false);
    const [lang, setLang] = react_1.default.useState('');
    const locale = (0, useSelector_1.useSelector)(selectors.currentLocaleSelector);
    const dispatch = (0, react_redux_1.useDispatch)();
    return (<>
      <PrimaryButton_1.PrimaryButton textStyle={textStyle} style={style} onPress={() => setModalVisible(true)}>
        {locale}
      </PrimaryButton_1.PrimaryButton>
      <ThemedModal_1.ThemedModal onBackdropPress={() => {
            setLang('');
            setModalVisible(false);
        }} onModalHide={() => {
            if (lang === '')
                return;
            dispatch(actions.setLocale(lang));
        }} setIsVisible={setModalVisible} isVisible={modalVisible}>
        <Container>
          {core_1.availableAppLocales.map((langItem, index) => {
            return (<Column key={index} onPress={() => {
                    setLang(langItem);
                    setModalVisible(false);
                }}>
                <LangText isActive={locale === langItem}>{langItem}</LangText>
              </Column>);
        })}
        </Container>
      </ThemedModal_1.ThemedModal>
    </>);
};
exports.LanguageSelect = LanguageSelect;
const Container = native_1.default.View `
  align-self: center;
`;
const Column = native_1.default.TouchableOpacity `
  align-items: center;
  margin-bottom: 20;
`;
const LangText = (0, native_1.default)(Text_1.Text) `
  color: ${(props) => (props.isActive ? `#f49200` : `#fff`)};
  font-family: Roboto-Black;
  font-size: 28;
`;
//# sourceMappingURL=LanguageSelect.jsx.map