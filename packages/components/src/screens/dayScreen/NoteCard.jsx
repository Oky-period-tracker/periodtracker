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
exports.NoteCard = NoteCard;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const selectors = __importStar(require("../../redux/selectors"));
const actions = __importStar(require("../../redux/actions"));
const useSelector_1 = require("../../hooks/useSelector");
const TextInput_1 = require("../../components/common/TextInput");
const react_redux_1 = require("react-redux");
const navigationService_1 = require("../../services/navigationService");
const Text_1 = require("../../components/common/Text");
const Icon_1 = require("../../components/common/Icon");
const assets_1 = require("../../assets");
const ConfirmAlert_1 = require("../../components/common/ConfirmAlert");
const i18n_1 = require("../../i18n");
const useScreenDimensions_1 = require("../../hooks/useScreenDimensions");
function NoteCard({ dataEntry }) {
    const { screenWidth: deviceWidth } = (0, useScreenDimensions_1.useScreenDimensions)();
    const noteObject = (0, useSelector_1.useSelector)((state) => selectors.notesAnswerSelector(state, dataEntry.date));
    const userID = (0, useSelector_1.useSelector)(selectors.currentUserSelector).id;
    const [title, setTitle] = react_1.default.useState(noteObject.title || '');
    const [titlePlaceholder, setTitlePlaceholder] = react_1.default.useState('title');
    const [notesPlaceholder, setNotesPlaceholder] = react_1.default.useState('daily_note_description');
    const dispatch = (0, react_redux_1.useDispatch)();
    const [notes, setNotes] = react_1.default.useState(noteObject.notes || '');
    return (<NoteCardContainer style={{
            width: 0.9 * deviceWidth,
            height: '95%',
            alignSelf: 'center',
            marginLeft: 5,
            marginRight: 15,
        }}>
      <UpperContent>
        <Row style={{ alignItems: 'center' }}>
          <Icon_1.Icon style={{ height: 30, width: 30, marginLeft: 10, marginRight: 10 }} source={assets_1.assets.static.icons.edit}/>
          <Container>
            <TextInput_1.TextInput onFocus={() => setTitlePlaceholder('empty')} onBlur={() => setTitlePlaceholder('title')} onChange={(text) => setTitle(text)} onEndEditing={() => dispatch(actions.answerNotesCard({ title, notes, userID, utcDateTime: dataEntry.date }))} label={titlePlaceholder} value={title} inputStyle={{
            fontStyle: title === '' ? 'italic' : 'normal',
            textAlign: 'left',
        }} style={{ width: '100%' }}/>
          </Container>
        </Row>
        <Row style={{ flex: 1, width: '100%' }}>
          <TextInput_1.TextInput onChange={(text) => setNotes(text)} onFocus={() => setNotesPlaceholder('empty')} onBlur={() => setNotesPlaceholder('daily_note_description')} onEndEditing={() => dispatch(actions.answerNotesCard({ title, notes, userID, utcDateTime: dataEntry.date }))} label={notesPlaceholder} value={notes || ''} inputStyle={{
            paddingTop: 20,
            textAlignVertical: 'top',
            textAlign: 'left',
            height: '100%',
            fontStyle: notes === '' ? 'italic' : 'normal',
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
        }} style={{
            height: '100%',
            marginTop: 0,
        }} multiline={true}/>
        </Row>
      </UpperContent>
      <LowerContent onPress={() => {
            (0, ConfirmAlert_1.ConfirmAlert)((0, i18n_1.translate)('note_saved'), (0, i18n_1.translate)('note_saved_caption'), () => {
                (0, navigationService_1.BackOneScreen)();
            });
        }}>
        <HeaderText>save</HeaderText>
      </LowerContent>
    </NoteCardContainer>);
}
const NoteCardContainer = native_1.default.View `
  flex-direction: column;
  background-color: #fff;
  border-radius: 10px;
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
  padding-horizontal: 12;
  padding-vertical: 12;
  border-top-left-radius: 10;
  border-top-right-radius: 10;
  background-color: #fff;
  justify-content: center;
  align-items: center;
  elevation: 5;
`;
const LowerContent = native_1.default.TouchableOpacity `
  height: 80px;
  width: 100%;
  elevation: 4;
  border-bottom-left-radius: 10;
  border-bottom-right-radius: 10;
  background-color: #efefef;
  justify-content: center;
  align-items: center;
`;
const HeaderText = (0, native_1.default)(Text_1.Text) `
  font-size: 16;
  text-align: center;
  align-self: center;
  color: #000;
  font-family: Roboto-Black;
`;
//# sourceMappingURL=NoteCard.jsx.map