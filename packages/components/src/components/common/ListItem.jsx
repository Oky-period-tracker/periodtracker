"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListItem = void 0;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const Text_1 = require("./Text");
const ListItem = ({ title = null, description = null, renderControls = null, style = null, }) => {
    return (<Container>
      <Row style={style}>
        <Title>{title}</Title>
        {description && <Description>{description}</Description>}
        {renderControls && <Selectors>{renderControls()}</Selectors>}
      </Row>
    </Container>);
};
exports.ListItem = ListItem;
const Container = native_1.default.View `
  flex: 1;
  padding-horizontal: 2px;
`;
const Row = native_1.default.View `
  height: 100%;
  flex-direction: row;
  padding-horizontal: 10px;
  align-items: center;
  justify-content: center;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
`;
const Title = (0, native_1.default)(Text_1.Text) `
  width: 33%;
  font-size: 16;
  text-align: left;
  font-family: Roboto-Black;
  text-transform: capitalize;
  padding-right: 10px;
  padding-left: 10px;
  color: #000;
`;
const Description = (0, native_1.default)(Text_1.Text) `
  flex: 1;
  font-size: 12;
  color: #000;
`;
const Selectors = native_1.default.View `
  flex: 0.8;
  align-items: flex-end;
`;
//# sourceMappingURL=ListItem.jsx.map