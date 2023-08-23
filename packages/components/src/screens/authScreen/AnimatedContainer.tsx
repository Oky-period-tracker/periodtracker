import React from 'react'
import { Animated, Platform } from 'react-native'
import styled from 'styled-components/native'
import { Text } from '../../components/common/Text'
import { SignUp } from './SignUp'
import { Login } from './Login'
import { ForgotPassword } from './ForgotPassword'
import { DeleteAccount } from './DeleteAccount'
import { Icon } from '../../components/common/Icon'
import { assets } from '../../assets/index'
import { KeyboardAwareAvoidance } from '../../components/common/KeyboardAwareAvoidance'

const { Value } = Animated

export function AnimatedContainer({ toggled }) {
  const [contentState, setContentState] = React.useState(0)
  const [heightInner] = React.useState(new Value(80))
  const innerOpacity = React.useRef(new Value(0))
  const [expanded, setExpanded] = React.useState(false)
  const [viewable, setViewable] = React.useState(true)

  const toggle = () => {
    if (expanded) {
      setExpanded((val) => !val)
      Animated.timing(innerOpacity.current, {
        toValue: expanded ? 0 : 1,
        duration: 350,
        useNativeDriver: true,
      }).start()
    }
    toggled(expanded)
    setViewable(expanded)
    Animated.timing(heightInner, {
      toValue: expanded ? 80 : maxHeight,
      duration: 350,
      useNativeDriver: false,
    }).start(() => {
      if (!expanded) {
        setExpanded((val) => !val)
        Animated.timing(innerOpacity.current, {
          toValue: expanded ? 0 : 1,
          duration: 350,
          useNativeDriver: true,
        }).start()
      }
    })
  }

  const transition = ({ height, newContentState }) => {
    Animated.timing(heightInner, {
      toValue: height,
      duration: 350,
      useNativeDriver: false,
    }).start(() => {
      setContentState(newContentState)
    })
  }

  const content = getContent(contentState, heightInner, toggle, setContentState)
  let maxHeight = 260
  return (
    <>
      <Container
        style={{
          backgroundColor: Platform.OS === 'ios' ? '' : 'white',
          borderRadius: 10,
          elevation: 4,
        }}
      >
        <KeyboardAwareAvoidance>
          <UpperContent
            expanded={expanded}
            onPress={() => {
              setContentState(0)
              maxHeight = 280
              toggle()
            }}
          >
            <HeaderText expanded={expanded}>{content.title}</HeaderText>
            {expanded && (
              <Icon
                source={assets.static.icons.close}
                style={{ height: 30, width: 30, position: 'absolute', right: 30 }}
              />
            )}
          </UpperContent>
          <LowerContent style={{ height: heightInner }} expanded={expanded}>
            {!expanded && (
              <Touchable
                onPress={() => {
                  setContentState(1)
                  maxHeight = 300
                  toggle()
                }}
              >
                <HeaderText>log_in</HeaderText>
              </Touchable>
            )}
            {expanded && (
              <Animated.View style={{ opacity: innerOpacity.current, width: '100%' }}>
                {content.component}
              </Animated.View>
            )}
          </LowerContent>
        </KeyboardAwareAvoidance>
      </Container>
      <Container>
        {(viewable || contentState === 1) && ( // This is so the forgot password and delete account are present on this specific state
          <Row style={{ position: 'absolute', marginTop: 15, justifyContent: 'space-between' }}>
            <Col style={{ alignItems: 'flex-end', paddingRight: 10 }}>
              <TouchableText
                disabled={expanded && contentState !== 1}
                onPress={() => {
                  if (contentState === 1) {
                    transition({ height: 260, newContentState: 2 })
                    return
                  }
                  setContentState(2)
                  maxHeight = 260
                  toggle()
                }}
              >
                <Text
                  style={{
                    marginBottom: 10,
                    fontFamily: 'Roboto-Black',
                    textDecorationLine: 'underline',
                    color: '#000',
                  }}
                >
                  forgot_password
                </Text>
              </TouchableText>
              <TouchableText
                disabled={expanded && contentState !== 1}
                onPress={() => {
                  if (contentState === 1) {
                    transition({ height: 310, newContentState: 3 })
                    return
                  }
                  setContentState(3)
                  maxHeight = 310
                  toggle()
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Roboto-Black',
                    textDecorationLine: 'underline',
                    color: '#000',
                  }}
                >
                  delete_account
                </Text>
              </TouchableText>
            </Col>
          </Row>
        )}
      </Container>
    </>
  )
}

const getContent = (value, heightInner, toggle, setContentState) => {
  switch (value) {
    case 0:
      return {
        title: 'sign_up',
        component: <SignUp heightInner={heightInner} />,
      }
    case 1:
      return { title: 'log_in', component: <Login /> }
    case 2:
      return {
        title: 'forgot_password',
        component: <ForgotPassword {...{ toggle, setContentState }} />,
      }
    case 3:
      return {
        title: 'delete_account',
        component: <DeleteAccount {...{ toggle, setContentState }} />,
      }
    default:
      return { title: 'sign_up', component: null }
  }
}

const HeaderText = styled(Text)<{ expanded: boolean }>`
  font-size: 16;
  text-align: center;
  align-self: center;
  color: ${(props) => (props.expanded ? `#fff` : `#000`)};
  font-family: Roboto-Black;
`

const UpperContent = styled.TouchableOpacity<{ expanded: boolean }>`
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
`
const Touchable = styled.TouchableOpacity`
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
`

const LowerContent = styled(Animated.View)<{ expanded: boolean }>`
  width: 100%;
  border-bottom-left-radius: 10;
  border-bottom-right-radius: 10;
  background-color: #fff;
  justify-content: center;
  align-items: center;
`

const Row = styled.View`
  flex-direction: row;
  margin-horizontal: auto;
  align-items: center;
  justify-content: center;
`

const TouchableText = styled.TouchableOpacity``

const Container = styled.View`
  flex-direction: column;
  width: 100%;
`

const Col = styled.View`
  flex: 1;
`
