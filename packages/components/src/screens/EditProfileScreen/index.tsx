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
import { BackOneScreen } from '../../services/navigationService'
import { TextInputSettings } from '../../components/common/TextInputSettings'
import { KeyboardAwareAvoidance } from '../../components/common/KeyboardAwareAvoidance'
import { Text } from '../../components/common/Text'
import { translate } from '../../i18n'
import _ from 'lodash'
import { EditSecretQuestionModal } from './EditSecretQuestionModal'
import { EditPasswordModal } from './EditPasswordModal'
import { useEditProfile } from './useEditProfile'

const deviceWidth = Dimensions.get('window').width
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
                items={[gender, ...remainingGenders]}
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
              <ChangeSecretButton onPress={() => setIsPasswordModalVisible(true)}>
                <ConfirmText>change_secret</ConfirmText>
              </ChangeSecretButton>
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

const ConfirmText = styled(Text)`
  font-family: Roboto-Black;
  text-align: center;
  font-size: 16;
  color: #fff;
`
