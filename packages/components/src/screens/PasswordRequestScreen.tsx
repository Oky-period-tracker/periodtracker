import React from 'react'
import styled from 'styled-components/native'
import { useDispatch } from 'react-redux'
import * as actions from '../redux/actions'
import { Text } from '../components/common/Text'
import { TextInput } from '../components/common/TextInput'
import * as selectors from '../redux/selectors'
import { navigateAndReset } from '../services/navigationService'
import { BackgroundTheme } from '../components/layout/BackgroundTheme'
import { PageContainer } from '../components/layout/PageContainer'
import { useSelector } from '../hooks/useSelector'
import { KeyboardAwareAvoidance } from '../components/common/KeyboardAwareAvoidance'
import { SpinLoader } from '../components/common/SpinLoader'
import _ from 'lodash'

export function PasswordRequestScreen() {
  const dispatch = useDispatch()
  const user = useSelector(selectors.currentUserSelector)
  const [loading, setLoading] = React.useState(false)
  const [valid, setValid] = React.useState(false)
  const [passwordError, setPasswordError] = React.useState(false)
  const [nameError, setNameError] = React.useState(false)
  const [name, setName] = React.useState(user.name)
  const [password, setPassword] = React.useState('')

  return (
    <BackgroundTheme>
      <PageContainer style={{ justifyContent: 'center' }}>
        <KeyboardAwareAvoidance>
          <Container style={{ backgroundColor: 'white', borderRadius: 10, elevation: 4 }}>
            <UpperContent>
              <HeaderText style={{ color: '#fff' }}>password_request</HeaderText>
            </UpperContent>
            <LowerContent style={{ height: 260 }}>
              <Container
                style={{
                  height: 180,
                  backgroundColor: 'white',
                  paddingHorizontal: 15,
                  elevation: 4,
                }}
              >
                <TextInput
                  style={{ marginTop: 20 }}
                  onChange={(text) => setName(text)}
                  label="name"
                  isValid={valid}
                  hasError={nameError}
                  value={name}
                />
                <TextInput
                  onChange={(text) => setPassword(text)}
                  label="password"
                  secureTextEntry={true}
                  isValid={valid}
                  hasError={passwordError}
                  value={password}
                />
              </Container>
              <Touchable
                onPress={() => {
                  const trimmedPassword = _.toLower(password).trim()
                  setLoading(true)
                  if (trimmedPassword === user.password && name === user.name) {
                    setNameError(false)
                    setPasswordError(false)
                    setValid(true)
                    requestAnimationFrame(() => {
                      navigateAndReset('MainStack', null)
                    })
                  } else if (trimmedPassword === user.password && name !== user.name) {
                    setLoading(false)
                    setPasswordError(false)
                    setNameError(true)
                  } else if (trimmedPassword !== user.password && name === user.name) {
                    setLoading(false)
                    setNameError(false)
                    setPasswordError(true)
                  } else {
                    setNameError(true)
                    setPasswordError(true)
                    setLoading(false)
                  }
                }}
              >
                <HeaderText>confirm</HeaderText>
              </Touchable>
            </LowerContent>
          </Container>
        </KeyboardAwareAvoidance>
        <Column>
          <TouchableText
            onPress={() => {
              dispatch(actions.logoutRequest())
            }}
          >
            <Text
              style={{
                marginBottom: 10,
                fontFamily: 'Roboto-Black',
                textDecorationLine: 'underline',
              }}
            >
              back_to_signup
            </Text>
          </TouchableText>
        </Column>
        <SpinLoader isVisible={loading} setIsVisible={setLoading} />
      </PageContainer>
    </BackgroundTheme>
  )
}

const HeaderText = styled(Text)`
  font-size: 16;
  text-align: center;
  align-self: center;
  color: #000;
  font-family: Roboto-Black;
`

const UpperContent = styled.View`
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  background-color: #e3629b;
  height: 80px;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  elevation: 4;
`

const LowerContent = styled.View`
  width: 100%;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: #fff;
  justify-content: center;
  align-items: center;
`

const Container = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  shadow-color: #efefef;
  shadow-offset: 0px 2px;
  shadow-opacity: 10px;
  shadow-radius: 2px;
`

const Touchable = styled.TouchableOpacity`
  height: 80px;
  width: 100%;
  justify-content: center;
  align-items: center;
`

const TouchableText = styled.TouchableOpacity``

const Column = styled.View`
  width: 100%;
  margin-top: 10px;
  align-items: flex-end;
  padding-right: 10px;
`

const Overlay = styled.View`
  position: absolute;
  align-items: center;
  justify-content: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  elevation: 6;
`
