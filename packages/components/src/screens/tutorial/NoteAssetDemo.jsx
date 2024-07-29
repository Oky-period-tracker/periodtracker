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
exports.NoteAssetDemo = NoteAssetDemo;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const index_1 = require("../../assets/index");
const Icon_1 = require("../../components/common/Icon");
const TextInput_1 = require("../../components/common/TextInput");
const Text_1 = require("../../components/common/Text");
const i18n_1 = require("../../i18n");
const react_native_tts_1 = __importDefault(require("react-native-tts"));
const useSelector_1 = require("../../hooks/useSelector");
const selectors = __importStar(require("../../redux/selectors"));
const useScreenDimensions_1 = require("../../hooks/useScreenDimensions");
function NoteAssetDemo({ step }) {
    const { screenWidth, screenHeight } = (0, useScreenDimensions_1.useScreenDimensions)();
    const hasTtsActive = (0, useSelector_1.useSelector)(selectors.isTtsActiveSelector);
    react_1.default.useEffect(() => {
        if (hasTtsActive) {
            if (step === 4) {
                react_native_tts_1.default.speak((0, i18n_1.translate)('title'));
                react_native_tts_1.default.speak((0, i18n_1.translate)('daily_note_description'));
                react_native_tts_1.default.speak((0, i18n_1.translate)('save'));
            }
        }
    }, [step, hasTtsActive]);
    return (<NoteCardContainer style={{
            width: 0.6 * screenWidth,
            height: 0.4 * screenHeight,
            marginLeft: 30,
        }}>
      <UpperContent>
        <Row style={{ alignItems: 'center' }}>
          <Icon_1.Icon style={{ height: 20, width: 20, marginLeft: 2, marginRight: 2 }} source={index_1.assets.static.icons.edit}/>
          <Container>
            <TextInput_1.TextInput label={'title'} value={''} inputStyle={{
            fontStyle: 'italic',
            textAlign: 'left',
            fontSize: 8,
            height: 20,
            borderRadius: 10,
        }} style={{ height: 20, width: '100%' }}/>
          </Container>
        </Row>
        <Row style={{ flex: 1, width: '100%' }}>
          <TextInput_1.TextInput label={'daily_note_description'} value={''} inputStyle={{
            paddingTop: 10,
            textAlign: 'left',
            textAlignVertical: 'top',
            height: '100%',
            fontStyle: 'italic',
            fontSize: 8,
            borderRadius: 10,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
        }} style={{
            height: '100%',
            marginTop: 0,
        }} multiline={true}/>
        </Row>
      </UpperContent>
      <LowerContent>
        <HeaderText>save</HeaderText>
      </LowerContent>
    </NoteCardContainer>);
}
const NoteCardContainer = native_1.default.View `
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
  elevation: 6;
  margin-horizontal: 10px;
`;
const Row = native_1.default.View `
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
`;
const Container = native_1.default.View `
  flex: 1;
`;
const UpperContent = native_1.default.View `
  flex: 1;
  width: 100%;
  flex-direction: column;
  padding-horizontal: 5;
  padding-vertical: 5;
  border-top-left-radius: 10;
  border-top-right-radius: 10;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  elevation: 5;
`;
const LowerContent = native_1.default.TouchableOpacity `
  height: 40px;
  width: 100%;
  elevation: 4;
  border-bottom-left-radius: 10;
  border-bottom-right-radius: 10;
  background-color: #efefef;
  justify-content: center;
  align-items: center;
`;
const HeaderText = (0, native_1.default)(Text_1.Text) `
  font-size: 8;
  text-align: center;
  align-self: center;
  color: #000;
  font-family: Roboto-Black;
`;
//# sourceMappingURL=NoteAssetDemo.jsx.map