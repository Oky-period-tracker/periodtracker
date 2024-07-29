"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimatedContainer = AnimatedContainer;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const native_1 = __importDefault(require("styled-components/native"));
const Text_1 = require("../../components/common/Text");
const SignUp_1 = require("./SignUp");
const Login_1 = require("./Login");
const ForgotPassword_1 = require("./ForgotPassword");
const DeleteAccount_1 = require("./DeleteAccount");
const Icon_1 = require("../../components/common/Icon");
const index_1 = require("../../assets/index");
const KeyboardAwareAvoidance_1 = require("../../components/common/KeyboardAwareAvoidance");
const tablet_1 = require("../../config/tablet");
const { Value } = react_native_1.Animated;
function AnimatedContainer({ toggled }) {
    const [contentState, setContentState] = react_1.default.useState(0);
    const [heightInner] = react_1.default.useState(new Value(80));
    const innerOpacity = react_1.default.useRef(new Value(0));
    const [expanded, setExpanded] = react_1.default.useState(false);
    const [viewable, setViewable] = react_1.default.useState(true);
    const toggle = () => {
        if (expanded) {
            setExpanded((val) => !val);
            react_native_1.Animated.timing(innerOpacity.current, {
                toValue: expanded ? 0 : 1,
                duration: 350,
                useNativeDriver: true,
            }).start();
        }
        toggled(expanded);
        setViewable(expanded);
        react_native_1.Animated.timing(heightInner, {
            toValue: expanded ? 80 : maxHeight,
            duration: 350,
            useNativeDriver: false,
        }).start(() => {
            if (!expanded) {
                setExpanded((val) => !val);
                react_native_1.Animated.timing(innerOpacity.current, {
                    toValue: expanded ? 0 : 1,
                    duration: 350,
                    useNativeDriver: true,
                }).start();
            }
        });
    };
    const transition = ({ height, newContentState }) => {
        react_native_1.Animated.timing(heightInner, {
            toValue: height,
            duration: 350,
            useNativeDriver: false,
        }).start(() => {
            setContentState(newContentState);
        });
    };
    const content = getContent(contentState, heightInner, toggle, setContentState);
    let maxHeight = 260;
    return (<>
      <Container style={styles.container}>
        <KeyboardAwareAvoidance_1.KeyboardAwareAvoidance>
          <UpperContent expanded={expanded} onPress={() => {
            setContentState(0);
            maxHeight = 280;
            toggle();
        }}>
            <HeaderText expanded={expanded}>{content.title}</HeaderText>
            {expanded && <Icon_1.Icon source={index_1.assets.static.icons.close} style={styles.icon}/>}
          </UpperContent>
          <LowerContent style={{ height: heightInner }} expanded={expanded}>
            {!expanded && (<Touchable onPress={() => {
                setContentState(1);
                maxHeight = 300;
                toggle();
            }}>
                <HeaderText>log_in</HeaderText>
              </Touchable>)}
            {expanded && (<react_native_1.Animated.View style={[styles.animated, { opacity: innerOpacity.current }]}>
                {content.component}
              </react_native_1.Animated.View>)}
          </LowerContent>
        </KeyboardAwareAvoidance_1.KeyboardAwareAvoidance>
      </Container>
      <Container>
        {(viewable || contentState === 1) && ( // This is so the forgot password and delete account are present on this specific state
        <Row>
            <Col>
              <TouchableText disabled={expanded && contentState !== 1} onPress={() => {
                if (contentState === 1) {
                    transition({ height: 260, newContentState: 2 });
                    return;
                }
                setContentState(2);
                maxHeight = 260;
                toggle();
            }}>
                <Text_1.Text style={styles.text}>forgot_password</Text_1.Text>
              </TouchableText>
              <TouchableText disabled={expanded && contentState !== 1} onPress={() => {
                if (contentState === 1) {
                    transition({ height: 310, newContentState: 3 });
                    return;
                }
                setContentState(3);
                maxHeight = 310;
                toggle();
            }}>
                <Text_1.Text style={styles.text}>delete_account</Text_1.Text>
              </TouchableText>
            </Col>
          </Row>)}
      </Container>
    </>);
}
const getContent = (value, heightInner, toggle, setContentState) => {
    switch (value) {
        case 0:
            return {
                title: 'sign_up',
                component: <SignUp_1.SignUp heightInner={heightInner}/>,
            };
        case 1:
            return { title: 'log_in', component: <Login_1.Login /> };
        case 2:
            return {
                title: 'forgot_password',
                component: <ForgotPassword_1.ForgotPassword {...{ toggle, setContentState }}/>,
            };
        case 3:
            return {
                title: 'delete_account',
                component: <DeleteAccount_1.DeleteAccount {...{ toggle, setContentState }}/>,
            };
        default:
            return { title: 'sign_up', component: null };
    }
};
const HeaderText = (0, native_1.default)(Text_1.Text) `
  font-size: 16;
  text-align: center;
  align-self: center;
  color: ${(props) => (props.expanded ? `#fff` : `#000`)};
  font-family: Roboto-Black;
`;
const UpperContent = native_1.default.TouchableOpacity `
  border-top-left-radius: 10;
  border-top-right-radius: 10;
  background-color: ${(props) => (props.expanded ? `#e3629b` : `#fff`)};
  elevation: ${(props) => (props.expanded ? 4 : 0)};
  height: 80px;
  border-bottom-width: ${(props) => (props.expanded ? 0 : 0.7)};
  border-color: #dbdcdd;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;
const Touchable = native_1.default.TouchableOpacity `
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`;
const LowerContent = (0, native_1.default)(react_native_1.Animated.View) `
  width: 100%;
  border-bottom-left-radius: 10;
  border-bottom-right-radius: 10;
  background-color: #fff;
  justify-content: center;
  align-items: center;
`;
const Row = native_1.default.View `
  flex-direction: row;
  margin-horizontal: auto;
  align-items: center;
  position: absolute;
  margin-top: 15;
  justify-content: space-between;
`;
const TouchableText = native_1.default.TouchableOpacity ``;
const Container = native_1.default.View `
  flex-direction: column;
  width: ${tablet_1.IS_TABLET ? '75%' : '100%'};
  max-width: 520px;
`;
const Col = native_1.default.View `
  flex: 1;
  align-items: flex-end;
  padding-right: 10;
`;
const styles = react_native_1.StyleSheet.create({
    container: {
        backgroundColor: react_native_1.Platform.OS === 'ios' ? '' : 'white',
        borderRadius: 10,
        elevation: 4,
    },
    icon: { height: 30, width: 30, position: 'absolute', right: 30 },
    animated: {
        width: '100%',
    },
    text: {
        marginBottom: 10,
        fontFamily: 'Roboto-Black',
        textDecorationLine: 'underline',
        color: '#000',
    },
});
//# sourceMappingURL=AnimatedContainer.jsx.map