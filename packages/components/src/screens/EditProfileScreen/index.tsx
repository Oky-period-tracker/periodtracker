import React from 'react'
import styled from 'styled-components/native'
import { Alert, Dimensions } from 'react-native'
import { PageContainer } from '../../components/layout/PageContainer'
import { BackgroundTheme } from '../../components/layout/BackgroundTheme'
import { Header } from '../../components/common/Header'
import { Icon } from '../../components/common/Icon'
import { SelectBox } from '../../components/common/SelectBox'
import { DateOfBirthInput } from '../../components/common/DateOfBirthInput'
import { assets } from '../../assets/index'
import { useSelector } from '../../redux/useSelector'
import * as selectors from '../../redux/selectors'
import * as actions from '../../redux/actions'
import { useDispatch } from 'react-redux'
import { BackOneScreen } from '../../services/navigationService'
import { httpClient } from '../../services/HttpClient'
import { TextInputSettings } from '../../components/common/TextInputSettings'
import { KeyboardAwareAvoidance } from '../../components/common/KeyboardAwareAvoidance'
import { ThemedModal } from '../../components/common/ThemedModal'
import { Text } from '../../components/common/Text'
import { TextInput } from '../../components/common/TextInput'
import { translate } from '../../i18n'
import _ from 'lodash'
import {
  decrypt,
  encrypt,
  formatPassword,
  hash,
  validatePassword,
  verifyStoreCredentials,
} from '../../services/auth'
import { EditSecretQuestionModal } from './EditSecretQuestionModal'
import { v4 as uuidv4 } from 'uuid'

const deviceWidth = Dimensions.get('window').width
const minPasswordLength = 1
const inputWidth = deviceWidth - 180

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

export function EditProfileScreen() {
  const reduxDispatch = useDispatch()
  const currentUser = useSelector(selectors.currentUserSelector)
  const appToken = useSelector(selectors.appTokenSelector)
  const storeCredentials = useSelector(selectors.storeCredentialsSelector)

  const [name, setName] = React.useState(currentUser.name)
  const [dateOfBirth, setDateOfBirth] = React.useState(currentUser.dateOfBirth)
  const [gender, setGender] = React.useState(currentUser.gender)
  const [location, setLocation] = React.useState(currentUser.location)
  const [password, setPassword] = React.useState(currentUser.password)
  const [secretAnswer, setSecretAnswer] = React.useState('')
  const [isVisible, setIsVisible] = React.useState(false)

  const [isSecretModalVisible, setIsSecretModalVisible] = React.useState(false)

  const remainingGenders = ['Female', 'Male', 'Other'].filter((item) => {
    return item !== currentUser.gender
  })
  const remainingLocations = ['Urban', 'Rural'].filter((item) => {
    return item !== currentUser.location
  })
  remainingLocations.unshift(currentUser.location)
  const [showPasscode, setShowPasscode] = React.useState(false)

  const onConfirm = () => {
    //
  }

  const onSecretConfirm = () => {
    //
  }

  const onConfirmResetQuestion = async ({
    currentAnswer,
    newAnswer,
  }: // question,
  {
    currentAnswer: string
    newAnswer: string
    question: string
  }) => {
    const usernameHash = hash(currentUser.name)
    const credentials = storeCredentials[usernameHash]

    if (!credentials) {
      return // TODO: ERROR ?
    }

    const currentAnswerCorrect = verifyStoreCredentials({
      username: currentUser.name,
      password: currentAnswer,
      storeCredentials,
      method: 'answer',
    })

    if (!currentAnswerCorrect) {
      return // TODO: Show alert
    }

    const secretKey = decrypt(credentials.secretKeyEncryptedWithAnswer, currentAnswer)

    const answer = formatPassword(newAnswer)
    const secretKeyEncryptedWithAnswer = encrypt(secretKey, answer)

    const answerSalt = uuidv4()
    const answerHash = hash(answer + answerSalt)

    try {
      // TODO: Check user is guest

      await httpClient.editUserSecretAnswer({
        appToken,
        previousSecretAnswer: formatPassword(currentAnswer),
        nextSecretAnswer: answer,
      })

      // Update redux AFTER successful API request
      reduxDispatch(
        actions.editAnswer({
          usernameHash,
          answerSalt,
          answerHash,
          secretKeyEncryptedWithAnswer,
        }),
      )

      setIsSecretModalVisible(false)
    } catch (err) {
      // TODO: Show alert, update failed
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
                // hasError={notValid && !(password.length >= minPasswordLength)}
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
              <ChangeSecretButton onPress={() => setIsSecretModalVisible(true)}>
                <ConfirmText>change_secret</ConfirmText>
              </ChangeSecretButton>
            </Row>
          </Container>
        </KeyboardAwareAvoidance>
        <ConfirmButton onPress={onConfirm}>
          <ConfirmText style={{ color: '#000' }}>confirm</ConfirmText>
        </ConfirmButton>
      </PageContainer>

      {/* ===== Modals ===== */}
      <ThemedModal {...{ isVisible, setIsVisible, onBackdropPress: () => null }}>
        <CardModal>
          <QuestionText>reset_password_question</QuestionText>
          <TextInput
            onChange={(value) => setSecretAnswer(value)}
            label="secret_answer"
            value={secretAnswer}
          />
          <Confirm onPress={onSecretConfirm}>
            <ConfirmText>confirm</ConfirmText>
          </Confirm>
        </CardModal>
      </ThemedModal>

      <EditSecretQuestionModal
        isVisible={isSecretModalVisible}
        setIsVisible={setIsSecretModalVisible}
        onConfirm={onConfirmResetQuestion}
      />
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
