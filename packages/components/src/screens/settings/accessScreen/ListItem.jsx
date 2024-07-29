"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListItem = void 0;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const react_native_1 = require("react-native");
const Text_1 = require("../../../components/common/Text");
const ListItem = ({ title = null, subtitle = null, renderControls = null, innerStyle = null, style = null, }) => {
    return (<Container style={style}>
      <Row style={innerStyle}>
        <Col>
          <Title style={styles.capitalize}>{title}</Title>
          {subtitle ? <Description>{subtitle}</Description> : null}
        </Col>
        {renderControls ? <Controls>{renderControls()}</Controls> : null}
      </Row>
    </Container>);
};
exports.ListItem = ListItem;
const Container = native_1.default.View `
  padding-horizontal: 2px;
`;
const Row = native_1.default.View `
  flex-direction: row;
  padding-left: 43;
  padding-right: 21;
  padding-vertical: 16;
  align-items: center;
  justify-content: space-between;
  border-color: #ddd;
  border-bottom-width: 1px;
`;
const Title = (0, native_1.default)(Text_1.Text) `
  font-size: 26;
  font-family: Roboto-Black;
  color: #000;
`;
const Description = (0, native_1.default)(Text_1.Text) `
  font-size: 16;
  color: #000;
`;
const Col = native_1.default.View `
  flex-basis: 50%;
`;
const Controls = native_1.default.View ``;
const styles = react_native_1.StyleSheet.create({
    capitalize: {
        textTransform: 'capitalize',
    },
});
//# sourceMappingURL=ListItem.jsx.map