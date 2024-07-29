"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmoji = isEmoji;
const emoji_regex_1 = __importDefault(require("emoji-regex"));
function isEmoji(str) {
    const emojiRegex = (0, emoji_regex_1.default)();
    const match = str.match(emojiRegex);
    return match && match.length === 1;
}
//# sourceMappingURL=isEmoji.js.map