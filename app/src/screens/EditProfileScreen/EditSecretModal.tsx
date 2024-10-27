import React from 'react'
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Modal, ModalProps } from '../../components/Modal'
import { Hr } from '../../components/Hr'
import { Text } from '../../components/Text'
import { Input } from '../../components/Input'
import { useSelector } from '../../redux/useSelector'
import { appTokenSelector, currentUserSelector } from '../../redux/selectors'
import { httpClient } from '../../services/HttpClient'
import {
  changeLocalAnswer,
  commitAltAnswer,
  deleteAltAnswer,
  formatPassword,
} from '../../services/auth'
import { WheelPickerModal } from '../../components/WheelPickerModal'
import { questionOptions } from '../../config/options'
import { WheelPickerOption } from '../../components/WheelPicker'
import { useTranslate } from '../../hooks/useTranslate'
import { useColor } from '../../hooks/useColor'
import { User } from '../../types'

export const EditSecretModal = ({ visible, toggleVisible }: ModalProps) => {
  const translate = useTranslate()
  const currentUser = useSelector(currentUserSelector) as User
  const appToken = useSelector(appTokenSelector)
  const { backgroundColor } = useColor()

  const [errorsVisible, setErrorsVisible] = React.useState(false)
  const [previousSecret, setPreviousSecret] = React.useState('')
  const [nextSecret, setNextSecret] = React.useState('')

  const [secretQuestion, setSecretQuestion] = React.useState(currentUser.secretQuestion)
  const onChangeQuestion = (option: WheelPickerOption | undefined) => {
    if (!option) {
      return
    }
    setSecretQuestion(option.value)
  }

  const previousFormatted = formatPassword(previousSecret)
  const nextFormatted = formatPassword(nextSecret)
  const { isValid, errors } = validate(previousFormatted, nextFormatted, secretQuestion)

  const initialSecretOption = questionOptions.find((item) => item.value === secretQuestion)

  const successAlert = () => {
    Alert.alert(
      translate('success'),
      translate('secret_change_success_description'),
      [
        {
          text: translate('continue'),
        },
      ],
      { cancelable: false },
    )
  }

  const failAlert = () => {
    Alert.alert(
      translate('unsuccessful'),
      translate('could_not_change_secret'),
      [
        {
          text: translate('continue'),
        },
      ],
      { cancelable: false },
    )
  }

  const sendRequest = async (previousSecretAnswer: string, nextSecretAnswer: string) => {
    await httpClient.editUserSecretAnswer({
      appToken,
      previousSecretAnswer,
      nextSecretAnswer,
    })
  }

  const onConfirm = async () => {
    setErrorsVisible(true)

    if (!isValid) {
      return
    }

    //  if no appToken and isGuest, just change locally, no http request
    const onlyChangeLocally = !appToken && currentUser.isGuest

    // Temporarily save new password locally as _alt, and preserve old password
    const altAnswerSaved = await changeLocalAnswer(
      currentUser.id,
      previousSecret,
      nextSecret,
      onlyChangeLocally,
    )

    if (!altAnswerSaved || onlyChangeLocally) {
      return
    }

    try {
      await sendRequest(previousFormatted, nextFormatted)
      // Commit to new password locally, overwrite old password, remove _alt
      await commitAltAnswer(currentUser.id)
      toggleVisible()
      successAlert()
    } catch (error) {
      // Revert back to old answer
      deleteAltAnswer(currentUser.id)
      setPreviousSecret('')
      setNextSecret('')
      failAlert()
    }
  }

  React.useEffect(() => {
    // Reset
    setPreviousSecret('')
    setNextSecret('')
    setSecretQuestion(currentUser.secretQuestion)
    setErrorsVisible(false)
  }, [currentUser])

  return (
    <Modal
      visible={visible}
      toggleVisible={toggleVisible}
      style={[styles.modal, { backgroundColor }]}
    >
      <View style={styles.modalBody}>
        <Input
          value={previousSecret}
          onChangeText={setPreviousSecret}
          placeholder="old_secret_answer"
          secureTextEntry={true}
        />
        <WheelPickerModal
          initialOption={initialSecretOption}
          options={questionOptions}
          onSelect={onChangeQuestion}
          placeholder={'secret_question'}
          allowUndefined={false}
          enableTranslate={true}
        />
        <Input
          value={nextSecret}
          onChangeText={setNextSecret}
          placeholder="secret_answer"
          secureTextEntry={true}
          errors={errors}
          errorKeys={['secret_too_short']}
          errorsVisible={errorsVisible}
        />
      </View>

      <Hr />
      <TouchableOpacity onPress={onConfirm} style={styles.modalConfirm}>
        <Text style={styles.modalConfirmText}>confirm</Text>
      </TouchableOpacity>
    </Modal>
  )
}

const validate = (previous: string, next: string, question: string) => {
  const errors: string[] = []
  let isValid = true

  if (previous.length < 1) {
    isValid = false
    errors.push('secret_too_short')
  }

  if (next.length < 1) {
    isValid = false
    errors.push('secret_too_short')
  }

  if (!question) {
    isValid = false
  }

  return { isValid, errors }
}

const styles = StyleSheet.create({
  modal: {
    borderRadius: 20,
  },
  modalBody: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalConfirm: {
    padding: 24,
  },
  modalConfirmText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
})
