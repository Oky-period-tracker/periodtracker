"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = void 0;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const IconButton_1 = require("./buttons/IconButton");
const Text_1 = require("./Text");
const navigationService_1 = require("../../services/navigationService");
const i18n_1 = require("../../i18n");
const Header = ({ showGoBackButton = true, showScreenTitle = true, onPressBackButton = null, screenTitle, LeftComponent = null, style = null, textStyle = null, }) => {
    return (<Container style={style}>
      {showGoBackButton && !LeftComponent && (<IconButton_1.IconButton accessibilityLabel={(0, i18n_1.translate)('arrow_button')} onPress={onPressBackButton || (() => (0, navigationService_1.BackOneScreen)())} name="back"/>)}
      {LeftComponent && <LeftComponent />}
      {showScreenTitle && (<Text_1.TextWithoutTranslation style={Object.assign({ flex: 1, color: '#F49200', fontFamily: 'Roboto-Black', fontSize: 22, textAlign: 'right' }, textStyle)}>
          {capitalizeFLetter((0, i18n_1.translate)(screenTitle))}
        </Text_1.TextWithoutTranslation>)}
    </Container>);
};
exports.Header = Header;
const capitalizeFLetter = (inputString) => {
    if (inputString.length === 0)
        return '';
    return inputString[0].toUpperCase() + inputString.slice(1);
};
const Container = native_1.default.View `
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-horizontal: 10px;
  margin-vertical: 10px;
  height: 35px;
  z-index: 9;
`;
//# sourceMappingURL=Header.jsx.map