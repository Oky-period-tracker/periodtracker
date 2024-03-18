import React from 'react'
import { Animated, ScrollView } from 'react-native'
import styled from 'styled-components/native'
import { Text, TextWithoutTranslation } from '../../../components/common/Text'
import { TextInput } from '../../../components/common/TextInput'
import { VerticalSelectBox } from '../../../components/common/VerticalSelectBox'
import { SignUpFormLayout } from './SignUpFormLayout'
import { useMultiStepForm, formActions } from '../../../components/common/MultiStepForm'
import { httpClient } from '../../../services/HttpClient'
import { useDebounce } from '../../../hooks/useDebounce'
import { formHeights } from './FormHeights'
import { translate } from '../../../i18n'
import { SegmentControl } from '../../../components/common/SegmentControl'
import { AccommodationRequirementSelectItem } from '../../../components/common/AccommodationRequirementSelectItem'
import { BodyFontSize, SubTitleFontSize } from '../../../fonts/fontsGlobal'
import { AppAssets } from '@oky/core'
import { GenderIdentitySelectItem } from '../../../components/common/GenderIdentitySelectItem'

export function AskUserInformation({ step, heightInner }) {
  const scrollViewRef = React.useRef(null)
  const [{ app: state }, dispatch] = useMultiStepForm()
  const [notValid, setNotValid] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [nameNotAvailable, setNameNotAvailable] = React.useState(false)
  const minPasswordLength = 1
  const minNameLength = 3
  const [usernameError, setUsernameError] = React.useState(false)
  const [passcodeMatchError, setPasscodeMatchError] = React.useState(false)
  const {
    name,
    password,
    passwordConfirm,
    gender,
    genderIdentity,
    isPwd,
    accommodationRequirement,
    encyclopediaVersion,
    religion,
  } = state
  const [debouncedName] = useDebounce(name, 500) // to stop fast typing calls

  const disabilityQs = [
    'seeing',
    'hearing',
    'mobility',
    'self_care',
    'communication',
    'no_difficulty',
  ]

  const religionOptions = [
    'undisclosed_religion',
    'catholic',
    'islam',
    'born_again_christian',
    'iglesia_ni_cristo',
    'other_religion',
  ]

  type GenderIdentityOption = 'Yes' | 'No' | 'Other'
  const genderIdentityOptions: GenderIdentityOption[] = ['Yes', 'No', 'Other']

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

  const genders: Array<keyof AppAssets['static']['icons']> = ['Male', 'Female', 'Other']

  return (
    <SignUpFormLayout
      onSubmit={() => {
        if (!checkValidity()) {
          setNotValid(true)

          // Scroll to the "Password" field if it is empty
          if (password.length === 0 && scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true })
            setNotValid(true)
          }
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
        <ScrollView
          ref={scrollViewRef} // Set the ref for ScrollView
          contentContainerStyle={{
            alignItems: 'center',
            justifyContent: 'center',
          }}
          showsVerticalScrollIndicator={true}
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
            errorHeading="name"
            errorContent="name_info_label"
          />

          <GenderText>your_gender</GenderText>
          <Row>
            {genders.map((value) => {
              return (
                <SegmentControl
                  key={value}
                  option={value}
                  isActive={gender === value}
                  onPress={() => dispatch({ type: 'change-form-data', inputName: 'gender', value })}
                />
              )
            })}
          </Row>

          <GenderIdentityText>your_gender_identity</GenderIdentityText>
          <Row>
            {genderIdentityOptions.map((value) => {
              return (
                <GenderIdentitySelectItem
                  key={value}
                  genderIdentity={value}
                  isActive={genderIdentity === value}
                  onPress={() =>
                    dispatch({ type: 'change-form-data', inputName: 'genderIdentity', value })
                  }
                />
              )
            })}
          </Row>

          <DisabilityText>disability_question</DisabilityText>

          <Column>
            {disabilityQs.map((value) => (
              <AccommodationRequirementSelectItem
                key={value}
                accommodationRequirement={value}
                isActive={accommodationRequirement === value}
                onPress={() =>
                  dispatch({
                    type: 'change-form-data',
                    inputName: 'accommodationRequirement',
                    value,
                  })
                }
              />
            ))}
          </Column>

          <ReligionText>religion_question</ReligionText>
          <VerticalSelectBox
            items={religionOptions.map((option) => (option ? option : ''))}
            containerStyle={{
              height: 45,
              borderRadius: 22.5,
            }}
            height={45}
            maxLength={20}
            buttonStyle={{ right: 5, bottom: 7 }}
            onValueChange={(value) => {
              dispatch({ type: 'change-form-data', inputName: 'religion', value })

              if (value === 'islam') {
                dispatch({
                  type: 'change-form-data',
                  inputName: 'encyclopediaVersion',
                  value: 'Yes',
                })
              } else {
                dispatch({
                  type: 'change-form-data',
                  inputName: 'encyclopediaVersion',
                  value: 'No',
                })
              }
            }}
            hasError={true} // this is to permanently display the i button
            errorHeading="religion_perspective_heading"
            errorContent="religion_perspective_content"
          />

          {religion !== 'islam' && religion === 'undisclosed_religion' && (
            <>
              <EncyclopediaVersionText>encyclopedia_version_question</EncyclopediaVersionText>
              <VerticalSelectBox
                items={['No', 'Yes'].map((option) => (option ? option : ''))}
                containerStyle={{
                  height: 45,
                  borderRadius: 22.5,
                }}
                height={45}
                maxLength={20}
                buttonStyle={{ right: 5, bottom: 7 }}
                onValueChange={(value) =>
                  dispatch({ type: 'change-form-data', inputName: 'encyclopediaVersion', value })
                }
                hasError={encyclopediaVersion === 'Yes'}
                errorHeading="islamic_perspective_heading"
                errorContent="islamic_perspective_content"
              />
            </>
          )}

          <TextInput
            onChange={(value) =>
              dispatch({ type: 'change-form-data', inputName: 'password', value })
            }
            label="password"
            secureTextEntry={true}
            showInfoButton={true}
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
        </ScrollView>
      </Container>
    </SignUpFormLayout>
  )
}

const Column = styled.View`
  width: 80%;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 10px;
`
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
  font-size: ${SubTitleFontSize};
  margin-bottom: 10px;
  margin-top: 20px;
  color: #28b9cb;
`

const ErrorMessage = styled(TextWithoutTranslation)`
  font-size: 12
  margin-top: 10px;
  color: red;
`

const GenderIdentityText = styled(Text)`
  font-family: Roboto-Regular;
  font-size: ${SubTitleFontSize};
  margin-bottom: 10px;
  margin-top: 20px;
  color: #28b9cb;
  text-align: center;
`

const DisabilityText = styled(Text)`
  font-family: Roboto-Regular;
  font-size: ${SubTitleFontSize};
  margin-bottom: 10px;
  margin-top: 20px;
  color: #28b9cb;
  text-align: center;
`

const ReligionText = styled(Text)`
  font-family: Roboto-Regular;
  font-size: ${SubTitleFontSize};
  margin-bottom: 10px;
  margin-top: 20px;
  color: #28b9cb;
`

const EncyclopediaVersionText = styled(Text)`
  font-family: Roboto-Regular;
  font-size: ${BodyFontSize};
  margin-bottom: 10px;
  margin-top: 40px;
  color: #28b9cb;
  text-align: center;
`
