"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarSelectItem = AvatarSelectItem;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const asset_1 = require("../../services/asset");
function AvatarSelectItem({ avatarName, type = 'theme', }) {
    return (<react_native_1.View style={{
            width: '90%',
            height: '90%',
            margin: 4,
            backgroundColor: 'white',
            borderRadius: 10,
            overflow: 'hidden',
        }}>
      <react_native_1.Image source={(0, asset_1.getAsset)(`avatars.${avatarName}.${type}`)} resizeMode="contain" style={{
            width: '100%',
            height: '100%',
            alignSelf: 'center',
            aspectRatio: 1,
            resizeMode: 'contain',
        }}/>
    </react_native_1.View>);
}
//# sourceMappingURL=AvatarSelectItem.jsx.map