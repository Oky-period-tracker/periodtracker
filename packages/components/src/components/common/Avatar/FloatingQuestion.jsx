"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloatingQuestion = void 0;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const FloatingQuestion = ({ children, containerStyle = null }) => {
    return (<Container style={containerStyle}>
      <Dialog>{children}</Dialog>
      <Triangle />
    </Container>);
};
exports.FloatingQuestion = FloatingQuestion;
const Container = native_1.default.View ``;
const Dialog = native_1.default.View `
  width: 150;
  padding-horizontal: 16;
  padding-vertical: 10;
  border-radius: 14;
  background: #ffffff;
  elevation: 3;
  position: relative;
`;
const Triangle = native_1.default.View `
  flex-direction: row;
  width: 0;
  height: 0;
  background-color: transparent;
  border-style: solid;
  border-top-width: 22;
  border-right-width: 13;
  border-bottom-width: 0;
  border-left-width: 0;
  border-top-color: white;
  border-right-color: transparent;
  border-bottom-color: transparent;
  border-left-color: transparent;
  position: relative;
  left: 20;
`;
//# sourceMappingURL=FloatingQuestion.jsx.map