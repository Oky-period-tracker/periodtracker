import React from 'react'
import styled from 'styled-components/native'
import { Alert, StyleSheet } from 'react-native'
import { PageContainer } from '../../components/layout/PageContainer'
import { BackgroundTheme } from '../../components/layout/BackgroundTheme'
import { Header } from '../../components/common/Header'
import { Icon } from '../../components/common/Icon'
import { SelectBox } from '../../components/common/SelectBox'
import { DateOfBirthInput } from '../../components/common/DateOfBirthInput'
import { assets } from '../../assets/index'
import { useSelector } from '../../hooks/useSelector'
import * as selectors from '../../redux/selectors'
import { useDispatch } from 'react-redux'
import { BackOneScreen } from '../../services/navigationService'
import { TextInputSettings } from '../../components/common/TextInputSettings'
import { KeyboardAwareAvoidance } from '../../components/common/KeyboardAwareAvoidance'
import { Text } from '../../components/common/Text'
import { translate } from '../../i18n'
import _ from 'lodash'
import { useScreenDimensions } from '../../hooks/useScreenDimensions'
import { IS_TABLET } from '../../config/tablet'
import {
  decrypt,
  encrypt,
  formatPassword,
  hash,
  validatePassword,
  verifyStoreCredentials,
} from '../../services/auth'
import { EditSecretQuestionModal } from './EditSecretQuestionModal'
import { EditPasswordModal } from './EditPasswordModal'
import { useEditProfile } from './useEditProfile'

const minPasswordLength = 1
const secretQuestions = [
  'secret_question',
  `favourite_actor`,
  `favourite_teacher`,
  `childhood_hero`,
]
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
  const { screenWidth } = useScreenDimensions()
  const percentWidth = IS_TABLET ? 0.75 : 1
  let inputWidth = screenWidth * percentWidth

  if (inputWidth > maxWidth) {
    inputWidth = maxWidth
  }

  inputWidth -= 180 // 180 is the width of the icon

  const dispatch = useDispatch()
  const reduxDispatch = useDispatch()
  const currentUser = useSelector(selectors.currentUserSelector)

  const [name, setName] = React.useState(currentUser.name)
  const [dateOfBirth, setDateOfBirth] = React.useState(currentUser.dateOfBirth)
  const [gender, setGender] = React.useState(currentUser.gender)
  const [location, setLocation] = React.useState(currentUser.location)

  const remainingGenders = ['Female', 'Male', 'Other'].filter((item) => {
    return item !== currentUser.gender
  })
  const remainingLocations = ['Urban', 'Rural'].filter((item) => {
    return item !== currentUser.location
  })
  remainingLocations.unshift(currentUser.location)

  const onConfirm = () => {
    //
  }

  const {
    onConfirm,
    onConfirmPassword,
    onConfirmResetQuestion,
    // State
    name,
    setName,
    dateOfBirth,
    setDateOfBirth,
    gender,
    setGender,
    location,
    setLocation,
    // Constants
    remainingGenders,
    remainingLocations,
    // Modals
    isPasswordModalVisible,
    setIsPasswordModalVisible,
    isSecretModalVisible,
    setIsSecretModalVisible,
  } = useEditProfile()

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
                items={[gender, ...remainingGenders]}
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
            <Row style={{ marginBottom: 10 }}>
              <Icon
                source={assets.static.icons.lockL}
                style={{ marginRight: 38, height: 57, width: 57 }}
              />
              <ChangeSecretButton onPress={() => setIsPasswordModalVisible(true)}>
                <ConfirmText>change_secret</ConfirmText>
              </ChangeSecretButton>
            </Row>
            <Row style={styles.row}>
              <Icon source={assets.static.icons.shieldL} style={styles.icon} />
              <ChangeSecretButton onPress={() => setSecretIsVisible(true)}>
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
      <EditPasswordModal
        isVisible={isPasswordModalVisible}
        setIsVisible={setIsPasswordModalVisible}
        onConfirm={onConfirmPassword}
      />

      <EditSecretQuestionModal
        isVisible={isSecretModalVisible}
        setIsVisible={setIsSecretModalVisible}
        onConfirm={onConfirmResetQuestion}
      />
    </BackgroundTheme>
  )
}

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
