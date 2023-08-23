import React from 'react'
import styled from 'styled-components/native'
import { Alert, Dimensions } from 'react-native'
import { PageContainer } from '../components/layout/PageContainer'
import { BackgroundTheme } from '../components/layout/BackgroundTheme'
import { Header } from '../components/common/Header'
import { Icon } from '../components/common/Icon'
import { SelectBox } from '../components/common/SelectBox'
import { DateOfBirthInput } from '../components/common/DateOfBirthInput'
import { assets } from '../assets/index'
import { useSelector } from '../hooks/useSelector'
import * as selectors from '../redux/selectors'
import * as actions from '../redux/actions'
import { useDispatch } from 'react-redux'
import { BackOneScreen } from '../services/navigationService'
import { httpClient } from '../services/HttpClient'
import { TextInputSettings } from '../components/common/TextInputSettings'
import { KeyboardAwareAvoidance } from '../components/common/KeyboardAwareAvoidance'
import { ThemedModal } from '../components/common/ThemedModal'
import { Text } from '../components/common/Text'
import { TextInput } from '../components/common/TextInput'
import { VerticalSelectBox } from '../components/common/VerticalSelectBox'
import { translate } from '../i18n'
import _ from 'lodash'

const deviceWidth = Dimensions.get('window').width
const minPasswordLength = 1
const inputWidth = deviceWidth - 180
const secretQuestions = [
  'secret_question',
  `favourite_actor`,
  `favourite_teacher`,
  `childhood_hero`,
]

function showAlert(message) {
  Alert.alert(
    translate('something_went_wrong'),
    translate(message),
    [
      {
        text: translate('cancel'),
        onPress: () => BackOneScreen(),
        style: 'cancel',
      },
      { text: translate('close_try_again') },
    ],
    { cancelable: false },
  )
}
function showAcceptAlert(message) {
  Alert.alert(
    translate('something_went_wrong'),
    translate(message),
    [
      {
        text: translate('confirm'),
      },
    ],
    { cancelable: false },
  )
}

async function runInSequence(functions) {
  const results = []
  for (const fn of functions) {
    results.push(await fn())
  }
  return results
}

export function EditProfileScreen() {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectors.currentUserSelector)
  const appToken = useSelector(selectors.appTokenSelector)

  const [name, setName] = React.useState(currentUser.name)
  const [notValid, setNotValid] = React.useState(false)
  const [dateOfBirth, setDateOfBirth] = React.useState(currentUser.dateOfBirth)
  const [gender, setGender] = React.useState(currentUser.gender)
  const [location, setLocation] = React.useState(currentUser.location)
  const [password, setPassword] = React.useState(currentUser.password)
  const [secretAnswer, setSecretAnswer] = React.useState('')
  const [oldSecretAnswer, setOldSecretAnswer] = React.useState('')
  const [secretQuestion, setSecretQuestion] = React.useState(currentUser.secretQuestion)
  const [isVisible, setIsVisible] = React.useState(false)
  const [secretIsVisible, setSecretIsVisible] = React.useState(false)

  const remainingGenders = ['Female', 'Male', 'Other'].filter((item) => {
    return item !== currentUser.gender
  })
  const remainingLocations = ['Urban', 'Rural'].filter((item) => {
    return item !== currentUser.location
  })
  remainingLocations.unshift(currentUser.location)
  const [showPasscode, setShowPasscode] = React.useState(false)

  const tryToEditUserInfo = async () => {
    const hasInfoChanged =
      name !== currentUser.name ||
      dateOfBirth !== currentUser.dateOfBirth ||
      gender !== currentUser.gender ||
      location !== currentUser.location ||
      secretQuestion !== currentUser.secretQuestion
    if (!hasInfoChanged) {
      return null
    }

    try {
      await httpClient.editUserInfo({
        appToken,
        name,
        dateOfBirth,
        gender,
        location,
        secretQuestion,
      })

      dispatch(
        actions.editUser({
          name,
          dateOfBirth,
          gender,
          location,
          secretQuestion,
        }),
      )
    } catch (err) {
      throw new Error(translate('could_not_edit'))
    }
  }

  const tryToChangeSecretAnswer = async () => {
    const hasSecretAnswerChanged = secretAnswer !== '' && _.toLower(oldSecretAnswer).trim() !== ''
    if (!hasSecretAnswerChanged) {
      return null
    }

    try {
      await httpClient.editUserSecretAnswer({
        appToken,
        previousSecretAnswer: _.toLower(oldSecretAnswer).trim(),
        nextSecretAnswer: _.toLower(secretAnswer).trim(),
      })

      dispatch(
        actions.editUser({
          secretAnswer: _.toLower(secretAnswer).trim(),
        }),
      )
      setSecretAnswer('')
    } catch (err) {
      setSecretAnswer('')
      if (err && err.response && err.response.data) {
        if (err.response.data.name === 'BadRequestError') {
          if (err.response.data.message === 'wrong_previous_secret_answer') {
            const message = translate('wrong_old_secret_answer')
            throw new Error(message)
          }
        }
      }
      throw new Error(translate('could_not_change_secret'))
    }
  }

  const tryToChangePassword = async () => {
    const hasPasswordChanged = currentUser.password !== password
    if (!hasPasswordChanged) {
      return null
    }

    if (secretAnswer.length === 0) {
      setIsVisible(true)
      throw new Error()
    }

    try {
      await httpClient.resetPassword({
        name,
        secretAnswer: _.toLower(secretAnswer).trim(),
        password: _.toLower(password).trim(),
      })

      dispatch(
        actions.editUser({
          password: _.toLower(password).trim(),
        }),
      )
    } catch (err) {
      setSecretAnswer('')
      throw new Error('could_not_change_password')
    }
  }

  const saveChanges = async () => {
    setIsVisible(false)
    // for non-logged user, save the changes locally immediately
    if (!appToken) {
      const hasSecretAnswerChanged = secretAnswer !== '' && _.toLower(oldSecretAnswer).trim() !== ''
      if (hasSecretAnswerChanged) {
        if (_.toLower(oldSecretAnswer).trim() !== _.toLower(currentUser.secretAnswer).trim()) {
          showAcceptAlert(translate('wrong_old_secret_answer'))
          return
        }
      }

      dispatch(
        actions.editUser({
          name,
          dateOfBirth,
          gender,
          password,
          location,
          secretQuestion,
          secretAnswer:
            secretAnswer === '' ? currentUser.secretAnswer : _.toLower(secretAnswer).trim(),
        }),
      )
      BackOneScreen()
      return
    }
    try {
      await runInSequence([tryToEditUserInfo, tryToChangeSecretAnswer, tryToChangePassword])
      BackOneScreen()
    } catch (err) {
      if (err.message) {
        showAlert(err.message)
      }
    }
  }

  return (
    <BackgroundTheme>
      <PageContainer>
        <Header screenTitle="profile_edit" onPressBackButton={() => BackOneScreen()} />
        <KeyboardAwareAvoidance>
          <Container>
            <Row>
              <Icon
                source={assets.static.icons.profileL}
                style={{ marginRight: 38, height: 57, width: 57 }}
              />
              <TextInputSettings
                onChange={(text) => setName(text)}
                label="name"
                isValid={false}
                hasError={false}
                style={{ height: '100%', justifyContent: 'space-between', marginBottom: 0 }}
                underlineStyle={{ width: inputWidth }}
                inputStyle={{ fontFamily: 'Roboto-Black', fontSize: 18 }}
                value={name}
              />
            </Row>
            <Row>
              <Icon
                source={assets.static.icons.genderL}
                style={{ marginRight: 38, height: 57, width: 57 }}
              />
              <SelectBox
                itemStyle={{
                  fontSize: 18,
                  fontFamily: 'Roboto-Black',
                }}
                width={inputWidth}
                containerStyle={{
                  height: 57,
                  justifyContent: 'space-between',
                  width: inputWidth,
                }}
                buttonStyle={{ right: -10, bottom: 5 }}
                title="gender"
                items={[currentUser.gender, ...remainingGenders]}
                onValueChange={(value) => setGender(value)}
              />
            </Row>
            <Row>
              <Icon
                source={assets.static.icons.calendarL}
                style={{ marginRight: 38, height: 57, width: 57 }}
              />
              <DateOfBirthInput
                label={'birth_month_and_year'}
                textStyle={{ fontSize: 18, fontFamily: 'Roboto-Black', color: '#555' }}
                style={{
                  height: '100%',
                  justifyContent: 'space-between',
                  marginBottom: 0,
                  width: inputWidth,
                }}
                value={dateOfBirth}
                onChange={setDateOfBirth}
              />
            </Row>
            <Row>
              <Icon
                source={assets.static.icons.locationL}
                style={{ marginRight: 38, height: 57, width: 57 }}
              />
              <SelectBox
                title="location"
                items={remainingLocations}
                itemStyle={{
                  fontSize: 18,
                  fontFamily: 'Roboto-Black',
                }}
                width={inputWidth}
                containerStyle={{
                  height: 57,
                  justifyContent: 'space-between',
                  width: inputWidth,
                }}
                buttonStyle={{ right: -10, bottom: 5 }}
                onValueChange={(value) => setLocation(value)}
                isValid={false}
                hasError={false}
              />
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Icon
                source={assets.static.icons.lockL}
                style={{ marginRight: 38, height: 57, width: 57 }}
              />
              <TextInputSettings
                onChange={(text) => setPassword(text)}
                style={{ height: '100%', justifyContent: 'space-between', marginBottom: 0 }}
                label="password"
                isValid={password.length >= minPasswordLength}
                hasError={notValid && !(password.length >= minPasswordLength)}
                onFocus={() => setShowPasscode(true)}
                onBlur={() => setShowPasscode(false)}
                secureTextEntry={!showPasscode}
                underlineStyle={{ width: inputWidth }}
                inputStyle={{ fontFamily: 'Roboto-Black' }}
                value={password}
              />
            </Row>
            <Row style={{ marginBottom: 10 }}>
              <Icon
                source={assets.static.icons.shieldL}
                style={{ marginRight: 38, height: 57, width: 57 }}
              />
              <ChangeSecretButton onPress={() => setSecretIsVisible(true)}>
                <ConfirmText>change_secret</ConfirmText>
              </ChangeSecretButton>
            </Row>
          </Container>
        </KeyboardAwareAvoidance>
        <ConfirmButton
          onPress={async () => {
            setNotValid(false)
            if (password.length < minPasswordLength) {
              setNotValid(true)
              return
            }
            await saveChanges()
          }}
        >
          <ConfirmText style={{ color: '#000' }}>confirm</ConfirmText>
        </ConfirmButton>
      </PageContainer>
      {/* --------------------------------- modals --------------------------------- */}
      <ThemedModal {...{ isVisible, setIsVisible, onBackdropPress: () => null }}>
        <CardModal>
          <QuestionText>reset_password_question</QuestionText>
          <TextInput
            onChange={(value) => setSecretAnswer(value)}
            label="secret_answer"
            value={secretAnswer}
          />
          <Confirm onPress={saveChanges}>
            <ConfirmText>confirm</ConfirmText>
          </Confirm>
        </CardModal>
      </ThemedModal>
      <ThemedModal {...{ isVisible: secretIsVisible, setIsVisible: setSecretIsVisible }}>
        <CardModal>
          <QuestionText>reset_secret_question</QuestionText>

          <TextContainer>
            <TextInput
              onChange={(value) => setOldSecretAnswer(value)}
              label="old_secret_answer"
              value={oldSecretAnswer}
            />
            <VerticalSelectBox
              items={secretQuestions.map((questions) => (questions ? questions : ''))}
              containerStyle={{
                height: 45,
                borderRadius: 22.5,
              }}
              height={45}
              maxLength={20}
              buttonStyle={{ right: 5, bottom: 7 }}
              onValueChange={(value) => setSecretQuestion(value)}
              errorHeading="secret_q_error_heading"
              errorContent="secret_que_info"
            />
            <TextInput
              onChange={(value) => setSecretAnswer(value)}
              label="secret_answer"
              isValid={secretAnswer.length >= minPasswordLength}
              hasError={notValid && !(secretAnswer.length >= minPasswordLength)}
              value={secretAnswer}
              multiline={true}
            />
          </TextContainer>
          <Confirm
            onPress={() => {
              if (secretAnswer.length < minPasswordLength) {
                setNotValid(true)
                return
              }
              setSecretIsVisible(false)
            }}
          >
            <ConfirmText>confirm</ConfirmText>
          </Confirm>
        </CardModal>
      </ThemedModal>
    </BackgroundTheme>
  )
}

const TextContainer = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  shadow-color: #efefef;
  shadow-offset: 0px 2px;
  shadow-opacity: 1;
  shadow-radius: 2px;
`
const Container = styled.View`
  background-color: #fff;
  elevation: 4;
  margin-horizontal: 3px;
  margin-vertical: 3px;
  margin-bottom: 5px;
  border-radius: 10px;
  padding-horizontal: 30px;
  padding-vertical: 22px;
`
const TextRow = styled.View`
  width: 100%
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  background-color: red;
`
const Row = styled.View`
  flex-direction: row;
  height: 57px;
  align-items: flex-end;
  margin-bottom: 4px;
`
const Confirm = styled.TouchableOpacity`
  width: 100%;
  height: 45px;
  border-radius: 22.5px;
  background-color: #a2c72d;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  margin-top: 10px;
`

const ChangeSecretButton = styled.TouchableOpacity`
  width: ${inputWidth};
  height: 50px;
  border-radius: 25px;
  background-color: #a2c72d;
  align-items: center;
  justify-content: center;
`
const ConfirmButton = styled.TouchableOpacity`
  width: 100%;
  height: 60px;
  border-radius: 10px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  align-self: center;
  margin-top: 5px;
  margin-horizontal: 3px;
  elevation: 4;
`

const CardModal = styled.View`
  width: 90%;
  height: 400px;
  background-color: #fff;
  border-radius: 10px;
  padding-horizontal: 20px;
  padding-vertical: 20px;
  align-items: center;
  justify-content: space-around;
  align-self: center;
`
const ConfirmText = styled(Text)`
  font-family: Roboto-Black;
  text-align: center;
  font-size: 16;
  color: #fff;
`
const QuestionText = styled(Text)`
  font-size: 16;
  text-align: center;
`
