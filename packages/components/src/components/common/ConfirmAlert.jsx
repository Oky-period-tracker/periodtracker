"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmAlert = void 0;
const react_native_1 = require("react-native");
const i18n_1 = require("../../i18n");
const ConfirmAlert = (title, text, onPress) => {
    react_native_1.Alert.alert(title, text, [
        {
            text: (0, i18n_1.translate)('cancel'),
            onPress: () => null,
            style: 'cancel',
        },
        { text: (0, i18n_1.translate)('yes'), onPress },
    ], { cancelable: false });
};
exports.ConfirmAlert = ConfirmAlert;
//# sourceMappingURL=ConfirmAlert.jsx.map