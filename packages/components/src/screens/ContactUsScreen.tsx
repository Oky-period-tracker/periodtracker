import React from 'react'
import { StyleSheet, TouchableWithoutFeedback } from 'react-native'
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
import { navigate } from '../services/navigationService'
import { hapticAndSoundFeedback } from '../services/tonefeedback'

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
            <VerticalSelectBox
              height={45}
              maxLength={20}
              items={Reasons}
              itemStyle={styles.selectBoxItem}
              buttonStyle={styles.selectBoxButton}
              containerStyle={styles.selectBoxContainer}
              onValueChange={(value) => setReason(value)}
            />
            <TextInput
              label="message"
              value={message}
              multiline={true}
              numberOfLines={7}
              hasError={notValid && !(message.length >= 3)}
              onChange={(text) => setMessage(text)}
              inputStyle={styles.inputInput}
              style={styles.input}
              isValid={message.length >= 3}
            />
            {error && <ErrorText>request_error</ErrorText>}
          </MiddleSection>
        </KeyboardAwareAvoidance>
        <PrimaryButton onPress={sendForm} style={styles.send} rightIcon="send">
          send
        </PrimaryButton>
      </PageContainer>
      <ThemedModal {...{ isVisible, setIsVisible }}>
        <TouchableWithoutFeedback
          style={styles.thanks}
          onPress={() => {
            hapticAndSoundFeedback('general')
            navigate('SettingsScreen', null)
          }}
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

const styles = StyleSheet.create({
  selectBoxItem: {
    fontSize: 16,
  },
  selectBoxButton: {
    right: 10,
  },
  selectBoxContainer: {
    height: 45,
    borderRadius: 22.5,
  },
  input: {
    height: 200,
  },
  inputInput: {
    fontSize: 16,
    textAlignVertical: 'top',
    height: 200,
  },
  send: {
    width: '100%',
    maxWidth: undefined,
  },
  thanks: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
