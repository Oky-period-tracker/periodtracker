"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoPlayer = exports.VideoScreen = void 0;
const react_1 = __importDefault(require("react"));
const react_native_video_1 = __importDefault(require("react-native-video"));
const react_native_youtube_iframe_1 = __importDefault(require("react-native-youtube-iframe"));
const Header_1 = require("../components/common/Header");
const assets_1 = require("../assets");
const react_native_1 = require("react-native");
const react_native_orientation_locker_1 = __importDefault(require("react-native-orientation-locker"));
const useScreenDimensions_1 = require("../hooks/useScreenDimensions");
const i18n_1 = require("../i18n");
const navigationService_1 = require("../services/navigationService");
const tablet_1 = require("../config/tablet");
const VideoScreen = ({ navigation }) => {
    return (<react_native_1.View style={styles.screen}>
      <Header_1.Header screenTitle="empty"/>
      <exports.VideoPlayer navigation={navigation}/>
    </react_native_1.View>);
};
exports.VideoScreen = VideoScreen;
const ConfirmAlert = ({ title, text, onPress, onCancel, }) => {
    react_native_1.Alert.alert(title, text, [
        {
            text: (0, i18n_1.translate)('cancel'),
            onPress: onCancel,
            style: 'cancel',
        },
        { text: (0, i18n_1.translate)('yes'), onPress },
    ], { cancelable: false });
};
const VideoPlayer = ({ navigation }) => {
    const videoData = navigation.getParam('videoData'); // TODO_ALEX
    const { youtubeId, assetName } = videoData;
    const { screenWidth, screenHeight } = (0, useScreenDimensions_1.useScreenDimensions)();
    const [canUseInternet, setCanUseInternet] = react_1.default.useState(false);
    const onConfirm = () => setCanUseInternet(true);
    const canPlayBundleVideo = assetName && assetName.length > 0 && (assets_1.assets === null || assets_1.assets === void 0 ? void 0 : assets_1.assets.videos) && (assets_1.assets === null || assets_1.assets === void 0 ? void 0 : assets_1.assets.videos[assetName]);
    const hasYoutubeVideo = youtubeId && youtubeId.length > 0;
    const canPlayYoutubeVideo = hasYoutubeVideo && canUseInternet;
    react_1.default.useEffect(() => {
        if (canPlayBundleVideo || canPlayYoutubeVideo || !hasYoutubeVideo) {
            return;
        }
        ConfirmAlert({
            title: (0, i18n_1.translate)('internet_required_title'),
            text: (0, i18n_1.translate)('internet_required_text'),
            onPress: onConfirm,
            onCancel: () => (0, navigationService_1.BackOneScreen)(),
        });
    }, []);
    react_1.default.useEffect(() => {
        react_native_orientation_locker_1.default.unlockAllOrientations();
        return () => {
            if (tablet_1.IS_TABLET) {
                return;
            }
            react_native_orientation_locker_1.default.lockToPortrait();
        };
    }, []);
    // Bundled video
    if (canPlayBundleVideo) {
        return (<react_native_video_1.default source={assets_1.assets.videos[assetName]} style={styles.bundleVideo} controls={true} fullscreenAutorotate={true} resizeMode={'contain'}/>);
    }
    const videoAspectRatio = 16 / 9; // Aspect ratios might need to be saved in VideoData object if they vary
    let videoWidth = screenWidth;
    let videoHeight = videoWidth / videoAspectRatio;
    if (screenWidth > screenHeight) {
        videoHeight = screenHeight;
        videoWidth = videoHeight * videoAspectRatio;
    }
    if (canPlayYoutubeVideo) {
        // Youtube video
        return (<react_native_1.View style={styles.youtubeContainer}>
        <react_native_youtube_iframe_1.default width={videoWidth} height={videoHeight} videoId={youtubeId}/>
      </react_native_1.View>);
    }
    return <react_native_1.View style={styles.bundleVideo}/>;
};
exports.VideoPlayer = VideoPlayer;
const styles = react_native_1.StyleSheet.create({
    screen: Object.assign(Object.assign({}, react_native_1.StyleSheet.absoluteFillObject), { width: '100%', height: '100%', backgroundColor: 'black', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }),
    bundleVideo: {
        flex: 1,
        width: '100%',
    },
    youtubeContainer: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
//# sourceMappingURL=VideoScreen.jsx.map