import React from 'react'
import { TouchableWithoutFeedback } from 'react-native'
import styled from 'styled-components/native'
import { BackgroundTheme } from '../components/layout/BackgroundTheme'
import { Header } from '../components/common/Header'
import { VerticalSelectBox } from '../components/common/VerticalSelectBox'
import { PrimaryButton } from '../components/common/buttons/PrimaryButton'
import { PageContainer } from '../components/layout/PageContainer'
import { TextInput } from '../components/common/TextInput'
import { KeyboardAwareAvoidance } from '../components/common/KeyboardAwareAvoidance'
import { httpClient } from '../services/HttpClient'
import { useSelector } from '../hooks/useSelector'
import * as selectors from '../redux/selectors'
import moment from 'moment'
import { Text } from '../components/common/Text'
import { ThemedModal } from '../components/common/ThemedModal'

import { useTextToSpeechHook } from '../hooks/useTextToSpeechHook'
import { contactUsScreenText } from '../config'
import { BackOneScreen, navigate } from '../services/navigationService'

const Reasons = ['reason', 'report_bug', 'request_topic', 'Other', 'problem_app']

export function ContactUsScreen({ navigation }) {
  const [email, setEmail] = React.useState('')
  const user = useSelector(selectors.currentUserSelector)
  const locale = useSelector(selectors.currentLocaleSelector)
  const [reason, setReason] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [notValid, setNotValid] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [isVisible, setIsVisible] = React.useState(false)
  useTextToSpeechHook({ navigation, text: contactUsScreenText({ isVisible }) })
  async function sendForm() {
    setError(false)
    setIsVisible(false)
    if (reason === '' || reason === 'reason' || message === '') {
      setNotValid(true)
      return
    }
    try {
      await httpClient.sendContactUsForm({
        name: user.name,
        dateRec: moment().utc().startOf('day'),
        organization: 'user',
        platform: 'mobile',
        reason,
        email: email !== '' ? email : 'NA',
        status: 'open',
        content: message,
        lang: locale,
      })
      setMessage('')
      setEmail('')
      setIsVisible(true)
    } catch (err) {
      setError(true)
    }
  }

  return (
    <BackgroundTheme>
      <PageContainer>
        <Header screenTitle="contact_us" />
        <KeyboardAwareAvoidance>
          <MiddleSection>
            {/* @TODO: No contact details available */}
            {/* <TextInput
              label="contact_details"
              value={email}
              onChange={text => setEmail(text)}
              inputStyle={{ fontSize: 16 }}
              errorHeading="password_confirm_error_heading"
              errorContent="password_confirm_error_content"
            /> */}
            <VerticalSelectBox
              containerStyle={{
                height: 45,
                borderRadius: 22.5,
              }}
              height={45}
              maxLength={20}
              itemStyle={{ fontSize: 16 }}
              items={Reasons}
              buttonStyle={{ right: 10 }}
              onValueChange={(value) => setReason(value)}
            />
            <TextInput
              label="message"
              value={message}
              multiline={true}
              numberOfLines={7}
              hasError={notValid && !(message.length >= 3)}
              onChange={(text) => setMessage(text)}
              inputStyle={{ fontSize: 16, textAlignVertical: 'top', height: 200 }}
              style={{ height: 200 }}
              isValid={message.length >= 3}
              errorHeading="password_confirm_error_heading"
              errorContent="password_confirm_error_content"
            />
            {error && <ErrorText>request_error</ErrorText>}
          </MiddleSection>
        </KeyboardAwareAvoidance>
        <PrimaryButton onPress={sendForm} rightIcon="send">
          send
        </PrimaryButton>
      </PageContainer>
      <ThemedModal {...{ isVisible, setIsVisible }}>
        <TouchableWithoutFeedback
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => navigate('SettingsScreen', null)}
        >
          <InfoCardPicker>
            <Heading>thank_you</Heading>
            <TextContent>thank_you_content</TextContent>
          </InfoCardPicker>
        </TouchableWithoutFeedback>
      </ThemedModal>
    </BackgroundTheme>
  )
}

const MiddleSection = styled.View`
  border-radius: 10px;
  elevation: 4;
  background-color: #fff;
  width: 100%;
  align-items: center;
  margin-top: 15px;
  padding-vertical: 20px;
  padding-horizontal: 15px;
  margin-bottom: 7px;
`

const ErrorText = styled(Text)`
  color: red;
  text-align: center;
`

const InfoCardPicker = styled.View`
  width: 95%;
  background-color: #fff;
  border-radius: 10px;
  align-items: flex-start;
  justify-content: flex-start;
  align-self: center;
  padding-vertical: 15px;
  padding-horizontal: 15px;
`

const Heading = styled(Text)`
  font-family: Roboto-Black;
  font-size: 18;
  margin-bottom: 10px;
  color: #a2c72d;
`

const TextContent = styled(Text)`
  font-family: Roboto-Regular;
  font-size: 16;
  margin-bottom: 10px;
`
