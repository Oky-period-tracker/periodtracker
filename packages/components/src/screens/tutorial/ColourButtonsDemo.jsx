"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColourButtonsDemo = ColourButtonsDemo;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const ThemeContext_1 = require("../../components/context/ThemeContext");
const Text_1 = require("../../components/common/Text");
const index_1 = require("../../assets/index");
function ColourButtonsDemo({ showBlue = false }) {
    const { id: themeName } = (0, ThemeContext_1.useTheme)();
    return (<Container>
      <Row style={{ marginBottom: 20 }}>
        <Column>
          <Button disabled={true}>
            <Mask resizeMode="contain" source={showBlue
            ? index_1.assets.static.icons.clouds.period
            : index_1.assets.static.icons.clouds.notVerifiedDay}/>
          </Button>
          <InnerText style={{ top: -40 }}>{showBlue ? 'period' : 'unverified_button'}</InnerText>
        </Column>
        <Column>
          <Button style={[{ marginHorizontal: 10 }]} disabled={true}>
            <Mask resizeMode="contain" source={showBlue ? index_1.assets.static.icons.clouds.fertile : index_1.assets.static.icons.clouds.period}/>
          </Button>
          <InnerText style={{ top: -40 }}>{showBlue ? 'ovulation' : 'period'}</InnerText>
        </Column>
        <Column>
          <Button disabled={true}>
            <Mask resizeMode="contain" source={index_1.assets.static.icons.clouds.nonPeriod}/>
          </Button>
          <InnerText style={{ top: -40 }}>non_period</InnerText>
        </Column>
      </Row>
    </Container>);
}
const Container = native_1.default.View `
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Row = native_1.default.View `
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
const Column = native_1.default.View `
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Button = native_1.default.TouchableOpacity `
  height: 85;
  width: 85;
  align-items: center;
  justify-content: center;
`;
const InnerText = (0, native_1.default)(Text_1.Text) `
  color: white;
  font-size: 16;
  position: absolute;
  text-align: center;
  font-family: Roboto-Black;
`;
const Mask = native_1.default.ImageBackground `
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
`;
//# sourceMappingURL=ColourButtonsDemo.jsx.map