import React from 'react'
import styled from 'styled-components/native'
import { useDispatch } from 'react-redux'
import * as actions from '../redux/actions'
import { Text } from '../components/common/Text'
import { TextInput } from '../components/common/TextInput'
import * as selectors from '../redux/selectors'
import { BackgroundTheme } from '../components/layout/BackgroundTheme'
import { PageContainer } from '../components/layout/PageContainer'
import { useSelector } from '../redux/useSelector'
import { KeyboardAwareAvoidance } from '../components/common/KeyboardAwareAvoidance'
import { SpinLoader } from '../components/common/SpinLoader'
import _ from 'lodash'
import { formatPassword, verifyStoreCredentials } from '../services/auth'

export function PasswordRequestScreen() {
  const dispatch = useDispatch()
  const username = useSelector(selectors.lastLoggedInUsernameSelector)
  const user = useSelector(selectors.currentUserSelector)
  const storeCredentials = useSelector(selectors.storeCredentialsSelector)

  const [loading, setLoading] = React.useState(false)
  const [passwordError, setPasswordError] = React.useState(false)
  const [name, setName] = React.useState(username)
  const [password, setPassword] = React.useState('')

  const onConfirm = () => {
    setLoading(true)

    const passwordCorrect = verifyStoreCredentials({
      username: name,
      password,
      storeCredentials,
    })

    const legacyPasswordCorrect = verifyLegacyPassword()

    if (!passwordCorrect && !legacyPasswordCorrect) {
      setLoading(false)
      setPasswordError(true)
      return
    }

    dispatch(
      actions.initiateStoreSwitch({
        username,
        password,
      }),
    )
  }

  const verifyLegacyPassword = () => {
    if (!user) {
      return false
    }
    const enteredPassword = formatPassword(password)
    return enteredPassword === user?.password
  }

  const onBack = () => {
    dispatch(actions.clearLastLogin())
  }

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
                  value={name}
                  editable={false}
                />
                <TextInput
                  onChange={(text) => setPassword(text)}
                  label="password"
                  secureTextEntry={true}
                  hasError={passwordError}
                  value={password}
                />
              </Container>
              <Touchable onPress={onConfirm}>
                <HeaderText>confirm</HeaderText>
              </Touchable>
            </LowerContent>
          </Container>
        </KeyboardAwareAvoidance>
        <Column>
          <TouchableText onPress={onBack}>
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
