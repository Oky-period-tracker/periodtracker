"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fromAvatarMessages = fromAvatarMessages;
function fromAvatarMessages(response) {
    const avatarMessages = response.reduce((data, message) => {
        data.push({ id: message.id, content: message.content });
        return data;
    }, []);
    return { avatarMessages };
}
//# sourceMappingURL=avatarMessages.js.map