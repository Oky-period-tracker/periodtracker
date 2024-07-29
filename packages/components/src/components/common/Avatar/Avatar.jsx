"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Avatar = Avatar;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const lottie_react_native_1 = __importDefault(require("lottie-react-native"));
const index_1 = require("../../../assets/index");
const ProgressBar_1 = require("./ProgressBar");
const Text_1 = require("../Text");
const FloatingQuestion_1 = require("./FloatingQuestion");
const native_1 = __importDefault(require("styled-components/native"));
const Icon_1 = require("../Icon");
const HeartAnimation_1 = require("./HeartAnimation");
const useSelector_1 = require("../../../hooks/useSelector");
const selectors = __importStar(require("../../../redux/selectors/index"));
const moment_1 = __importDefault(require("moment"));
const DisplayTextContext_1 = require("../../context/DisplayTextContext");
const PredictionProvider_1 = require("../../context/PredictionProvider");
const asset_1 = require("../../../services/asset");
const lookingAndWave = { start: 0, end: 8 / 30, duration: 6500 };
const looking = { start: 0, end: 4 / 30, duration: 4000 };
const wave = { start: 4 / 30, end: 8 / 30, duration: 4000 };
const jump = { start: 8 / 30, end: 10 / 30, duration: 2200 };
const danceOne = { start: 10 / 30, end: 15 / 30, duration: 4000 };
const danceTwo = { start: 15 / 30, end: 20 / 30, duration: 4000 };
const danceThree = { start: 20 / 30, end: 25 / 30, duration: 5000 };
const danceFour = { start: 25 / 30, end: 30 / 30, duration: 5000 };
function Avatar({ style = null, isProgressVisible = true, textShown = '', disable = false, alertTextVisible = true, stationary = false, avatarStyle = null, }) {
    const { text: displayedText, hideDisplayText } = (0, DisplayTextContext_1.useDisplayText)();
    const [animatedHearts, setAnimatedHearts] = react_1.default.useState(0);
    const isJumpingToggled = react_1.default.useRef(false);
    const isDancingToggled = react_1.default.useRef(false);
    const randomDance = react_1.default.useRef(1);
    const selectedAvatar = (0, useSelector_1.useSelector)(selectors.currentAvatarSelector);
    const [animatedProgress] = react_1.default.useState(new react_native_1.Animated.Value(0));
    const { onPeriod } = (0, PredictionProvider_1.useTodayPrediction)();
    const cardAnswersToday = (0, useSelector_1.useSelector)((state) => selectors.cardAnswerSelector(state, moment_1.default.utc()));
    react_1.default.useEffect(() => {
        const intervalId = setTimeout(hideDisplayText, 3000);
        return () => {
            clearTimeout(intervalId);
        };
    }, [displayedText]);
    react_1.default.useEffect(() => {
        if (animatedHearts * 5 >= 100) {
            isDancingToggled.current = true;
        }
    }, [animatedHearts]);
    react_1.default.useEffect(() => {
        runLookingAnimation();
    }, []);
    const runLookingAnimation = () => {
        react_native_1.Animated.sequence([
            react_native_1.Animated.timing(animatedProgress, {
                toValue: 0,
                duration: 0,
                delay: 3000,
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(animatedProgress, {
                toValue: lookingAndWave.end,
                duration: lookingAndWave.duration,
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(animatedProgress, {
                toValue: lookingAndWave.start,
                duration: 0,
                useNativeDriver: true,
            }),
        ]).start(() => {
            if (isDancingToggled.current) {
                randomDance.current = Math.floor(Math.random() * (4 - 1)) + 1;
                randomDance.current === 1 && runSequencedAnimation(danceOne);
                randomDance.current === 2 && runSequencedAnimation(danceTwo);
                randomDance.current === 3 && runSequencedAnimation(danceThree);
                randomDance.current === 4 && runSequencedAnimation(danceFour);
                return;
            }
            if (isJumpingToggled.current) {
                runSequencedAnimation(jump);
                return;
            }
            runSequencedAnimation(danceFour);
        });
    };
    const runSequencedAnimation = (animation) => {
        react_native_1.Animated.sequence([
            react_native_1.Animated.timing(animatedProgress, {
                toValue: animation.start,
                duration: 0,
                delay: 3000,
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(animatedProgress, {
                toValue: animation.end,
                duration: animation.duration,
                useNativeDriver: true,
            }),
        ]).start(() => {
            isJumpingToggled.current = false;
            isDancingToggled.current = false;
            runLookingAnimation();
        });
    };
    return (<Container style={style}>
      {displayedText !== null && !disable && alertTextVisible && (<FloatingQuestion_1.FloatingQuestion containerStyle={{
                position: 'absolute',
                left: 75,
                top: react_native_1.Platform.OS === 'ios' ? -110 : -80,
                width: '85%',
            }}>
          <Text_1.TextWithoutTranslation>{displayedText}</Text_1.TextWithoutTranslation>
        </FloatingQuestion_1.FloatingQuestion>)}
      <react_native_1.TouchableOpacity disabled={disable} style={{ alignItems: 'flex-start', justifyContent: 'flex-start' }} activeOpacity={1} accessibilityLabel={displayedText} onPress={() => {
            isJumpingToggled.current = true;
            setAnimatedHearts(animatedHearts + 1);
        }}>
        {/* TODO_ALEX */}
        {/* @ts-ignore */}
        {!stationary && selectedAvatar !== 'oky' && (<lottie_react_native_1.default resizeMode="contain" style={Object.assign({ width: react_native_1.Platform.OS === 'ios' ? 120 : 125, bottom: react_native_1.Platform.OS === 'ios' ? 31 : 45 }, avatarStyle)} source={index_1.assets.lottie.avatars[selectedAvatar]} progress={animatedProgress}/>)}
        {/* TODO_ALEX */}
        {/* @ts-ignore */}
        {(stationary || selectedAvatar === 'oky') && (<react_native_1.Image source={(0, asset_1.getAsset)(`avatars.${selectedAvatar}.stationary_colour`)}/>)}
      </react_native_1.TouchableOpacity>
      {isProgressVisible && (<OverallProgressContainer style={{
                position: 'absolute',
                // TODO_ALEX
                // @ts-ignore
                bottom: selectedAvatar === 'oky' ? 10 : 115,
            }}>
          <ProgressBarContainer>
            <Icon_1.Icon source={heartImageFill(animatedHearts * 5)} style={{ height: 12, width: 20, marginRight: 5 }}/>
            <ProgressBar_1.ProgressBar color="#e3629b" value={animatedHearts * 5 >= 100 ? 100 : animatedHearts * 5}/>
          </ProgressBarContainer>
          {onPeriod && (<ProgressBarContainer>
              <Icon_1.Icon source={starImageFill(Object.keys(cardAnswersToday).length)} style={{ height: 12, width: 20, marginRight: 5 }}/>
              <ProgressBar_1.ProgressBar value={Object.keys(cardAnswersToday).length * 25 >= 100
                    ? 100
                    : Object.keys(cardAnswersToday).length * 25}/>
            </ProgressBarContainer>)}
        </OverallProgressContainer>)}
      {textShown !== '' && !isProgressVisible && (<InfoText style={{ bottom: 30 }}>{textShown}</InfoText>)}
      <HeartAnimation_1.HeartAnimation count={animatedHearts}/>
    </Container>);
}
const heartImageFill = (fill) => {
    if (fill < 50)
        return index_1.assets.static.icons.heart.empty;
    if (fill >= 50 && fill < 100)
        return index_1.assets.static.icons.heart.half;
    if (fill >= 100)
        return index_1.assets.static.icons.heart.full;
};
const starImageFill = (numberOfElements) => {
    if (numberOfElements === null)
        return index_1.assets.static.icons.starOrange.empty;
    if (numberOfElements < 2)
        return index_1.assets.static.icons.starOrange.empty;
    if (numberOfElements >= 2 && numberOfElements < 4)
        return index_1.assets.static.icons.starOrange.half;
    if (numberOfElements >= 4)
        return index_1.assets.static.icons.starOrange.full;
};
const Container = native_1.default.View `
  justify-content: center;
  align-items: center;
`;
const ProgressBarContainer = native_1.default.View `
  padding-horizontal: 13px;
  padding-left: 10px;
  flex-direction: row;
  align-items: flex-end;
`;
const OverallProgressContainer = native_1.default.View `
  justify-content: space-around;
  height: 27px;
  align-items: flex-start;
`;
const InfoText = (0, native_1.default)(Text_1.Text) `
  font-size: 13;
  font-family: Roboto-Black;
  color: #ff9e00;
`;
//# sourceMappingURL=Avatar.jsx.map