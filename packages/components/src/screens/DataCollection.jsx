"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATA_COLLECTION_SCREEN = void 0;
exports.DataCollection = DataCollection;
const react_1 = __importDefault(require("react"));
const PageContainer_1 = require("../components/layout/PageContainer");
const Text_1 = require("../components/common/Text");
const BackgroundTheme_1 = require("../components/layout/BackgroundTheme");
function DataCollection() {
    return (<BackgroundTheme_1.BackgroundTheme>
      <PageContainer_1.PageContainer>
        <Text_1.Text>Here are a few questions about you and your period.</Text_1.Text>
      </PageContainer_1.PageContainer>
    </BackgroundTheme_1.BackgroundTheme>);
}
exports.DATA_COLLECTION_SCREEN = 'DATA_COLLECTION_SCREEN';
//# sourceMappingURL=DataCollection.jsx.map