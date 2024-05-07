import React from 'react'
import styled from 'styled-components/native'
import { Alert, StyleSheet } from 'react-native'
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
import { useScreenDimensions } from '../hooks/useScreenDimensions'
import { IS_TABLET } from '../config/tablet'
import { ASK_CITY } from '../config'
import { ModalSearchBox } from '../components/common/ModalSearchBox'
import { helpCenterLocations } from '@oky/core'

const minPasswordLength = 1
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

const maxWidth = 800

export function EditProfileScreen() {
  const { screenWidth } = useScreenDimensions()
  const percentWidth = IS_TABLET ? 0.75 : 1
  let inputWidth = screenWidth * percentWidth

  if (inputWidth > maxWidth) {
    inputWidth = maxWidth
  }

  inputWidth -= 180 // 180 is the width of the icon

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
  const [city, setCity] = React.useState({ code: currentUser?.city, item: currentUser?.province })

  const remainingGenders = ['Female', 'Male', 'Other'].filter((item) => {
    return item !== currentUser.gender
  })
  const remainingLocations = ['Urban', 'Rural'].filter((item) => {
    return item !== currentUser.location
  })
  remainingLocations.unshift(currentUser.location)
  const [showPasscode, setShowPasscode] = React.useState(false)

  const serializeLocation = (obj: { item: string; code: string }) => {
    if (!obj) return
    const { item, code } = obj
    return `${item}, ${code}`
  }

  const deserializeLocation = (serializedLocation: string) => {
    const [item, code] = serializedLocation.split(', ')
    return { item, code }
  }

  const cities = React.useMemo(() => {
    // -------------- Cities -----------------------
    // TODO:PH filter based on users province (?)
    return helpCenterLocations
      ?.flatMap((item) => item.places)
      ?.map((itemCity: any) => serializeLocation({ item: itemCity.name, code: itemCity.name }))
  }, [])

  const tryToEditUserInfo = async () => {
    const hasInfoChanged =
      name !== currentUser.name ||
      dateOfBirth !== currentUser.dateOfBirth ||
      gender !== currentUser.gender ||
      location !== currentUser.location ||
      secretQuestion !== currentUser.secretQuestion ||
      city.code !== currentUser.city
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
        city: city.code,
      })

      dispatch(
        actions.editUser({
          name,
          dateOfBirth,
          gender,
          location,
          secretQuestion,
          city: city.code,
        }),
      )
    } catch (err) {
      throw new Error(translate('could_not_edit')) // TODO_ALEX: this is not displayed
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
            throw new Error(message) // TODO_ALEX: this is not displayed
          }
        }
      }
      throw new Error(translate('could_not_change_secret')) // TODO_ALEX: this is not displayed
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
      throw new Error('could_not_change_password') // TODO_ALEX: this is not displayed
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
          city: city.code,
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

  const defaultLabel = { code: translate('selectItemCity'), item: translate('selectItemCity') }
  // const citylabel =
  //   city.code === '' && (currentUser.city === '' || currentUser.city === '00') ? defaultLabel : city

  return (
    <BackgroundTheme>
      <PageContainer>
        <Header screenTitle="profile_edit" onPressBackButton={() => BackOneScreen()} />
        <KeyboardAwareAvoidance contentContainerStyle={styles.keyboardAwareAvoidance}>
          <Container>
            <Row>
              <Icon source={assets.static.icons.profileL} style={styles.icon} />
              <TextInputSettings
                onChange={(text) => setName(text)}
                label="name"
                isValid={false}
                hasError={false}
                style={styles.textInput}
                underlineStyle={{ width: inputWidth }}
                inputStyle={styles.textInputInput}
                value={name}
              />
            </Row>
            <Row>
              <Icon source={assets.static.icons.genderL} style={styles.icon} />
              <SelectBox
                itemStyle={styles.selectBoxItem}
                width={inputWidth}
                containerStyle={[
                  styles.selectBoxContainer,
                  {
                    width: inputWidth,
                  },
                ]}
                buttonStyle={styles.selectBoxButton}
                title="gender"
                items={[currentUser.gender, ...remainingGenders]}
                onValueChange={(value) => setGender(value)}
              />
            </Row>
            <Row>
              <Icon source={assets.static.icons.calendarL} style={styles.icon} />
              <DateOfBirthInput
                label={'birth_month_and_year'}
                textStyle={styles.dobInputText}
                style={[styles.dobInput, { width: inputWidth }]}
                value={dateOfBirth}
                onChange={setDateOfBirth}
              />
            </Row>
            <Row>
              <Icon source={assets.static.icons.locationL} style={styles.icon} />
              <SelectBox
                title="location"
                items={remainingLocations}
                itemStyle={styles.selectBoxItem}
                width={inputWidth}
                containerStyle={[
                  styles.selectBoxContainer,
                  {
                    width: inputWidth,
                  },
                ]}
                buttonStyle={styles.selectBoxButton}
                onValueChange={(value) => setLocation(value)}
                isValid={false}
                hasError={false}
              />
            </Row>
            {ASK_CITY ? (
              <Row>
                <Icon
                  source={assets.static.icons.locationL}
                  style={{ marginRight: 38, height: 57, width: 57 }}
                />
                <ModalSearchBox
                  currentItem={city?.code}
                  items={cities}
                  isValid={city !== null}
                  hasError={notValid && city === null}
                  containerStyle={{
                    height: 45,
                    borderRadius: 22.5,
                    marginBottom: 10,
                  }}
                  onSelection={(value) => {
                    setCity(deserializeLocation(value))
                  }}
                  height={45}
                  placeholder={'city'}
                  searchInputPlaceholder={`search_city`}
                />
              </Row>
            ) : null}
            <Row style={styles.row}>
              <Icon source={assets.static.icons.lockL} style={styles.icon} />
              <TextInputSettings
                onChange={(text) => setPassword(text)}
                style={[styles.textInput, { width: inputWidth }]}
                label="password"
                isValid={password.length >= minPasswordLength}
                hasError={notValid && !(password.length >= minPasswordLength)}
                onFocus={() => setShowPasscode(true)}
                onBlur={() => setShowPasscode(false)}
                secureTextEntry={!showPasscode}
                underlineStyle={{ width: inputWidth }}
                inputStyle={[styles.textInputInput, { width: inputWidth }]}
                value={password}
              />
            </Row>
            <Row style={styles.row}>
              <Icon source={assets.static.icons.shieldL} style={styles.icon} />
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
          <ConfirmText style={styles.confirm}>confirm</ConfirmText>
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
              containerStyle={styles.verticalSelectContainer}
              height={45}
              maxLength={20}
              buttonStyle={styles.verticalSelectButton}
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
  width: ${IS_TABLET ? 75 : 100}%;
  max-width: ${maxWidth}px;
  elevation: 4;
  margin-horizontal: 3px;
  margin-vertical: 3px;
  margin-bottom: 5px;
  border-radius: 10px;
  padding-horizontal: 30px;
  padding-vertical: 22px;
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
  width: 100%;
  max-width: 200px;
  height: 50px;
  border-radius: 25px;
  background-color: #a2c72d;
  align-items: center;
  justify-content: center;
  margin-left: auto;
`
const ConfirmButton = styled.TouchableOpacity`
  width: ${IS_TABLET ? 75 : 100}%;
  max-width: ${maxWidth}px;
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

const styles = StyleSheet.create({
  keyboardAwareAvoidance: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginRight: 38,
    height: 57,
    width: 57,
  },
  textInput: {
    height: '100%',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  textInputInput: {
    fontFamily: 'Roboto-Black',
    fontSize: 18,
  },
  selectBoxContainer: {
    height: 57,
    justifyContent: 'space-between',
  },
  selectBoxItem: {
    fontSize: 18,
    fontFamily: 'Roboto-Black',
  },
  selectBoxButton: {
    right: -10,
    bottom: 5,
  },
  dobInput: {
    height: '100%',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  dobInputText: {
    fontSize: 18,
    fontFamily: 'Roboto-Black',
    color: '#555',
  },
  row: {
    marginBottom: 10,
  },
  confirm: {
    color: '#000',
  },
  verticalSelectContainer: {
    height: 45,
    borderRadius: 22.5,
  },
  verticalSelectButton: {
    right: 5,
    bottom: 7,
  },
})
