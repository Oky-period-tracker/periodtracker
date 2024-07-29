"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarSelect = AvatarSelect;
const react_1 = __importDefault(require("react"));
const native_1 = __importDefault(require("styled-components/native"));
const AvatarOption_1 = require("./avatarSelect/AvatarOption");
function AvatarSelect({ avatars, value, onSelect, }) {
    return (<Container>
      {avatars.map((avatar) => (<AvatarOption_1.AvatarOption key={avatar} avatar={avatar} isSelected={value === avatar} onSelect={() => onSelect(avatar)}/>))}
    </Container>);
}
const Container = native_1.default.View `
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-wrap: wrap;
`;
//# sourceMappingURL=AvatarSelect.jsx.map