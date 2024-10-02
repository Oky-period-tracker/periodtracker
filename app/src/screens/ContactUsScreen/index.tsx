import * as React from 'react'
import { KeyboardAvoidingView, StyleSheet } from 'react-native'
import { Button } from '../../components/Button'
import { Screen } from '../../components/Screen'
import { ScreenComponent } from '../../navigation/RootNavigator'
import { useToggle } from '../../hooks/useToggle'
import { httpClient } from '../../services/HttpClient'
import { Modal } from '../../components/Modal'
import { Text } from '../../components/Text'
import { globalStyles } from '../../config/theme'
import moment from 'moment'
import { useSelector } from 'react-redux'
import { currentLocaleSelector, currentUserSelector } from '../../redux/selectors'
import { ErrorText } from '../../components/ErrorText'
import { Input } from '../../components/Input'
import { WheelPickerModal } from '../../components/WheelPickerModal'
import { reasonOptions } from '../../config/options'
import { WheelPickerOption } from '../../components/WheelPicker'
import { useColor } from '../../hooks/useColor'

const ContactUsScreen: ScreenComponent<'Contact'> = () => {
  const user = useSelector(currentUserSelector)
  const locale = useSelector(currentLocaleSelector)
  const { palette, backgroundColor } = useColor()

  const [reason, setReason] = React.useState<WheelPickerOption | undefined>(undefined)

  const [message, setMessage] = React.useState('')
  const [error, setError] = React.useState(false)

  const invalid = !reason || message === ''

  const [visible, toggleVisible] = useToggle()

  const send = async () => {
    if (invalid) {
      return
    }

    try {
      setError(false)

      await httpClient.sendContactUsForm({
        name: user?.name,
        dateRec: moment().utc().startOf('day'),
        organization: 'user',
        platform: 'mobile',
        reason,
        email: 'NA',
        status: 'open',
        content: message,
        lang: locale,
      })

      setMessage('')
      setReason(undefined)
      toggleVisible()
    } catch (err) {
      setError(true)
    }
  }

  return (
    <Screen style={styles.screen}>
      <KeyboardAvoidingView style={[styles.container, globalStyles.shadow, { backgroundColor }]}>
        <WheelPickerModal
          initialOption={reason}
          placeholder={'reason'}
          options={reasonOptions}
          onSelect={setReason}
          enableTranslate
        />
        <Input placeholder="message" onChangeText={setMessage} value={message} multiline={true} />
        {error && <ErrorText>request_error</ErrorText>}
        <Button onPress={send} style={styles.button} status={invalid ? 'basic' : 'primary'}>
          send
        </Button>
      </KeyboardAvoidingView>

      <Modal
        style={[styles.modal, { backgroundColor }]}
        visible={visible}
        toggleVisible={toggleVisible}
      >
        <Text style={[styles.modalTitle, { color: palette.primary.text }]}>thank_you</Text>
        <Text>thank_you_content</Text>
      </Modal>
    </Screen>
  )
}

export default ContactUsScreen

const styles = StyleSheet.create({
  screen: {
    padding: 24,
  },
  container: {
    borderRadius: 20,
    width: '100%',
    padding: 24,
    flex: 1,
    maxHeight: 400,
    marginBottom: 24,
    justifyContent: 'center',
  },
  button: {
    alignSelf: 'center',
    marginTop: 12,
  },
  modal: {
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 48,
  },
  modalTitle: {
    marginBottom: 12,
    fontSize: 20,
    fontWeight: 'bold',
  },
})
