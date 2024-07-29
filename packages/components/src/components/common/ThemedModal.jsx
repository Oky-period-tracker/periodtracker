"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemedModal = ThemedModal;
const react_native_modal_1 = __importDefault(require("react-native-modal"));
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const IconButton_1 = require("./buttons/IconButton");
function ThemedModal({ isVisible, setIsVisible, includeCloseButton = true, children, onModalHide = () => null, onModalWillShow = () => null, animationIn = 'fadeIn', animationOut = 'fadeOut', onBackdropPress = () => setIsVisible(false), backdropOpacity = 0.8, animationOutTiming = react_native_1.Platform.OS === 'ios' ? 300 : 600, }) {
    return (
    // @ts-ignore
    <react_native_modal_1.default isVisible={isVisible} backdropOpacity={backdropOpacity} customBackdrop={<react_native_1.TouchableOpacity onPress={onBackdropPress} importantForAccessibility="no-hide-descendants" style={styles.backdrop}/>} 
    // @ts-ignore
    animationIn={animationIn} 
    // @ts-ignore
    animationOut={animationOut} animationInTiming={600} animationOutTiming={animationOutTiming} backdropTransitionInTiming={600} backdropTransitionOutTiming={600} onModalHide={onModalHide} onModalWillShow={onModalWillShow} onBackdropPress={onBackdropPress} hideModalContentWhileAnimating={true} useNativeDriver={true}>
      {includeCloseButton ? (<IconButton_1.IconButton name="close" accessibilityLabel="close" onPress={() => setIsVisible(false)} touchableStyle={styles.close}/>) : null}
      {children}
    </react_native_modal_1.default>);
}
const styles = react_native_1.StyleSheet.create({
    close: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'black',
    },
});
//# sourceMappingURL=ThemedModal.jsx.map