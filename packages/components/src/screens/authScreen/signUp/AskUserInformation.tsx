import React from 'react'
import { Animated } from 'react-native'
import styled from 'styled-components/native'
import { Text, TextWithoutTranslation } from '../../../components/common/Text'
import { TextInput } from '../../../components/common/TextInput'
import { GenderSelectItem } from '../../../components/common/GenderSelectItem'
import { SignUpFormLayout } from './SignUpFormLayout'
import { useMultiStepForm, formActions } from '../../../components/common/MultiStepForm'
import { httpClient } from '../../../services/HttpClient'
import { useDebounce } from '../../../hooks/useDebounce'
import { formHeights } from './FormHeights'
import { translate } from '../../../i18n'

export function AskUserInformation({ step, heightInner }) {
  const [{ app: state }, dispatch] = useMultiStepForm()
  const [notValid, setNotValid] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [nameNotAvailable, setNameNotAvailable] = React.useState(false)
  const minPasswordLength = 1
  const minNameLength = 3
  const [usernameError, setUsernameError] = React.useState(false)
  const [passcodeMatchError, setPasscodeMatchError] = React.useState(false)
  const { name, password, passwordConfirm, gender } = state
  const [debouncedName] = useDebounce(name, 500) // to stop fast typing calls

  React.useEffect(() => {
    let ignore = false
    async function checkUserNameAvailability() {
      try {
        const response = await httpClient.getUserInfo(name)
        // user does exist
        if (!ignore) setNameNotAvailable(true)
      } catch (err) {
        // user does not exist
        if (!ignore) setNameNotAvailable(false)
      }
    }
    checkUserNameAvailability()
    return () => {
      ignore = true
    }
  }, [debouncedName])

  // @TODO: change this logic and hasError Logic to be neater, its in a terrible state
  function checkValidity() {
    if (!(name.length >= minNameLength)) {
      setUsernameError(true)
    }
    if (passwordConfirm !== password) {
      setPasscodeMatchError(true)
    }
    return (
      password.length >= minPasswordLength &&
      passwordConfirm === password &&
      name.length >= minNameLength
    )
  }

  if (loading) {
    return null
  }

  return (
    <SignUpFormLayout
      onSubmit={() => {
        if (!checkValidity()) {
          setNotValid(true)
          return
        }

        setLoading(true)
        Animated.timing(heightInner, {
          toValue: formHeights.askPassword + formHeights.buttonConfirmHeight,
          duration: 350,
          useNativeDriver: false,
        }).start(() => {
          dispatch({ formAction: formActions.goToStep('ask-password') })
        })
      }}
    >
      <Container
        style={{
          height: formHeights.askUserInformation,
          elevation: 4,
          paddingHorizontal: 15,
          backgroundColor: 'white',
          overflow: 'hidden',
        }}
      >
        {nameNotAvailable && <ErrorMessage>{translate('name_taken_error')}</ErrorMessage>}
        {usernameError && <ErrorMessage>{translate('username_too_short')}</ErrorMessage>}
        <TextInput
          inputStyle={{ color: '#555' }}
          onChange={(value) => {
            setUsernameError(false)
            dispatch({ type: 'change-form-data', inputName: 'name', value })
          }}
          label="enter_name"
          isValid={name.length >= minNameLength}
          hasError={notValid && !(name.length >= minNameLength)}
          showInfoButton={true}
          infoAccessibilityLabel={translate('name_info_label')}
          value={name}
          errorHeading="name_error_heading"
          errorContent="name_error_content"
        />

        <GenderText>your_gender</GenderText>
        <Row>
          {['Male', 'Female', 'Other'].map((value) => {
            return (
              <GenderSelectItem
                key={value}
                gender={value}
                isActive={gender === value}
                onPress={() => dispatch({ type: 'change-form-data', inputName: 'gender', value })}
              />
            )
          })}
        </Row>
        <TextInput
          onChange={(value) => dispatch({ type: 'change-form-data', inputName: 'password', value })}
          label="password"
          secureTextEntry={true}
          showInfoButton={true}
          infoAccessibilityLabel={translate('password_info_label')}
          isValid={password.length >= minPasswordLength}
          hasError={notValid && !(password.length >= minPasswordLength)}
          value={password}
          errorHeading="password_error_heading"
          errorContent="password_error_content"
        />
        <TextInput
          onChange={(value) => {
            setPasscodeMatchError(false)
            dispatch({ type: 'change-form-data', inputName: 'passwordConfirm', value })
          }}
          label="confirm_password"
          secureTextEntry={true}
          showInfoButton={false}
          isValid={passwordConfirm.length >= minPasswordLength && passwordConfirm === password}
          hasError={
            notValid &&
            !(passwordConfirm.length >= minPasswordLength && passwordConfirm === password)
          }
          value={passwordConfirm}
        />
        {passcodeMatchError && <ErrorMessage>{translate('passcodes_mismatch')}</ErrorMessage>}
      </Container>
    </SignUpFormLayout>
  )
}

const Row = styled.View`
  width: 80%;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 10px;
`

const Container = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
`

const GenderText = styled(Text)`
  font-family: Roboto-Regular;
  font-size: 14;
  margin-bottom: 5px;
  color: #28b9cb;
`

const ErrorMessage = styled(TextWithoutTranslation)`
  font-size: 12
  margin-top: 10px;
  color: red;
`
const PasswordDescription = styled(Text)`
  width: 95%;
  text-align: justify;
  font-size: 12;
  margin-bottom: 10px;
  color: #28b9cb;
`
