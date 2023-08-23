import React from 'react'
import styled from 'styled-components/native'
import { Text } from '../../components/common/Text'
import { TextInput } from '../../components/common/TextInput'
import { useDispatch } from 'react-redux'
import * as actions from '../../redux/actions'
import { useSelector } from '../../hooks/useSelector'
import { SpinLoader } from '../../components/common/SpinLoader'
import _ from 'lodash'

export function Login() {
  const dispatch = useDispatch()
  const { error: loginError, isLoggingIn } = useSelector((state) => state.auth)

  const [loading, setLoading] = React.useState(false)
  const [name, setName] = React.useState('')
  const [password, setPassword] = React.useState('')

  React.useEffect(() => {
    if (loginError) {
      setLoading(false)
    }
  }, [isLoggingIn])

  return (
    <Container>
      <Container
        style={{
          height: 220,
          paddingHorizontal: 15,
          backgroundColor: 'white',
          elevation: 4,
          overflow: 'hidden',
        }}
      >
        <TextInput
          onChange={(text) => setName(text)}
          label="name"
          value={name}
          errorHeading="login_name_error_heading"
          errorContent="login_name_error_content"
        />
        <TextInput
          onChange={(text) => setPassword(text)}
          label="password"
          secureTextEntry={true}
          value={password}
          errorHeading="login_password_error_heading"
          errorContent="login_password_error_content"
        />
        {loginError && <ErrorMessage>{loginError}</ErrorMessage>}
      </Container>
      <Touchable
        onPress={() => {
          setLoading(true)
          requestAnimationFrame(() => {
            dispatch(actions.loginRequest({ name, password: _.toLower(password).trim() }))
          })
        }}
      >
        <HeaderText>confirm</HeaderText>
      </Touchable>
      <SpinLoader isVisible={loading} setIsVisible={setLoading} />
    </Container>
  )
}

const Container = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  shadow-color: #d2d2d2;
  shadow-offset: 0px 2px;
  shadow-opacity: 2;
  shadow-radius: 2;
`

const Touchable = styled.TouchableOpacity`
  height: 80px;
  width: 100%;
  justify-content: center;
  align-items: center;
`
const HeaderText = styled(Text)<{ expanded: boolean }>`
  font-size: 16;
  text-align: center;
  align-self: center;
  color: ${(props) => (props.expanded ? `#fff` : `#000`)};
  font-family: Roboto-Black;
`
const Overlay = styled.View`
  position: absolute;
  align-items: center;
  justify-content: center;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`

const ErrorMessage = styled(Text)`
  font-size: 14;
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
  color: red;
`
