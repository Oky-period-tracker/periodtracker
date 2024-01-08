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
import { StyleSheet } from 'react-native'
import { IS_TABLET } from '../config/tablet'
import { formatPassword, hash } from '../services/auth'

export function PasswordRequestScreen() {
  const dispatch = useDispatch()
  const username = useSelector(selectors.lastLoggedInUsernameSelector)
  const storeCredentials = useSelector(selectors.storeCredentialsSelector)
  const [loading, setLoading] = React.useState(false)
  const [valid, setValid] = React.useState(false)
  const [passwordError, setPasswordError] = React.useState(false)
  const [nameError, setNameError] = React.useState(false)
  const [name, setName] = React.useState(username)
  const [password, setPassword] = React.useState('')

  const usernameHash = hash(username)
  const userCredentials = storeCredentials[usernameHash]

  if (!userCredentials) {
    // TODO_ALEX: handle this case, navigate away?
  }

  const { storeSalt, verificationSalt, passwordHash } = userCredentials

  const enteredPassword = formatPassword(password)
  const enteredPasswordHash = hash(enteredPassword + verificationSalt)

  return (
    <BackgroundTheme>
      <PageContainer style={styles.page}>
        <KeyboardAwareAvoidance contentContainerStyle={styles.pageInner}>
          <Container>
            <UpperContent>
              <HeaderText>password_request</HeaderText>
            </UpperContent>
            <LowerContent>
              <Container style={styles.containerInner}>
                <TextInput
                  style={styles.input}
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
                  setLoading(true)
                  if (enteredPasswordHash === passwordHash && name === username) {
                    setNameError(false)
                    setPasswordError(false)
                    setValid(true)

                    const keys = {
                      key: usernameHash,
                      secretKey: hash(enteredPassword + storeSalt),
                    }
                    dispatch(actions.initiateStoreSwitch({ keys, shouldMigrateData: false }))

                    requestAnimationFrame(() => {
                      navigateAndReset('StoreSwitchStack', null)
                    })
                  } else if (enteredPasswordHash === passwordHash && name !== username) {
                    setLoading(false)
                    setPasswordError(false)
                    setNameError(true)
                  } else if (enteredPasswordHash !== passwordHash && name === username) {
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
                <HeaderText style={styles.confirmButton}>confirm</HeaderText>
              </Touchable>
            </LowerContent>
          </Container>
        </KeyboardAwareAvoidance>
        <Row>
          <Column>
            <TouchableText
              onPress={() => {
                dispatch(actions.logoutRequest())
              }}
            >
              <Text style={styles.text}>back_to_signup</Text>
            </TouchableText>
          </Column>
        </Row>
        <SpinLoader isVisible={loading} setIsVisible={setLoading} />
      </PageContainer>
    </BackgroundTheme>
  )
}

const HeaderText = styled(Text)`
  font-size: 16;
  text-align: center;
  align-self: center;
  color: #fff;
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
  height: 260px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: #fff;
  justify-content: center;
  align-items: center;
`

const Container = styled.View`
  justify-content: center;
  align-items: center;
  width: ${IS_TABLET ? 75 : 100}%;
  max-width: 520px;
  shadow-color: #efefef;
  shadow-offset: 0px 2px;
  shadow-opacity: 10px;
  shadow-radius: 2px;
  background-color: #fff;
  elevation: 4;
  border-radius: 10px;
`

const Touchable = styled.TouchableOpacity`
  height: 80px;
  width: 100%;
  justify-content: center;
  align-items: center;
`

const TouchableText = styled.TouchableOpacity``

const Row = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
`

const Column = styled.View`
  width: ${IS_TABLET ? 75 : 100}%;
  max-width: 520px;
  margin-top: 10px;
  align-items: flex-end;
  padding-right: 8px;
`

const styles = StyleSheet.create({
  page: {
    justifyContent: 'center',
  },
  pageInner: {
    alignItems: 'center',
  },
  containerInner: {
    height: 180,
    paddingHorizontal: 15,
  },
  input: {
    marginTop: 20,
  },
  text: {
    marginBottom: 10,
    fontFamily: 'Roboto-Black',
    textDecorationLine: 'underline',
  },
  confirmButton: {
    color: '#000',
  },
})
