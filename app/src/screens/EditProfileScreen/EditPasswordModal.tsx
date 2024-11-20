import React from 'react'
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Modal, ModalProps } from '../../components/Modal'
import { Hr } from '../../components/Hr'
import { Text } from '../../components/Text'
import { Input } from '../../components/Input'
import { useSelector } from '../../redux/useSelector'
import { appTokenSelector, currentUserSelector } from '../../redux/selectors'
import { User } from '../../redux/reducers/private/userReducer'
import { httpClient } from '../../services/HttpClient'
import { useDispatch } from 'react-redux'
import { editUser } from '../../redux/actions'
import {
  changeLocalPassword,
  commitAltPassword,
  deleteAltPassword,
  formatPassword,
} from '../../services/auth'
import { useTranslate } from '../../hooks/useTranslate'
import { useColor } from '../../hooks/useColor'

export const EditPasswordModal = ({ visible, toggleVisible }: ModalProps) => {
  const translate = useTranslate()
  const appToken = useSelector(appTokenSelector)
  const currentUser = useSelector(currentUserSelector) as User
  const name = currentUser.name
  const reduxDispatch = useDispatch()
  const { backgroundColor } = useColor()

  const [secret, setSecret] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [errorsVisible, setErrorsVisible] = React.useState(false)

  const formattedPassword = formatPassword(newPassword)
  const formattedSecret = formatPassword(secret)

  const { isValid, errors } = validate(formattedPassword)

  const successAlert = () => {
    Alert.alert(
      translate('success'),
      translate('forgot_password_completed'),
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
      translate('password_change_fail_description'),
      [
        {
          text: translate('continue'),
        },
      ],
      { cancelable: false },
    )
  }

  const sendRequest = async (password: string, secretAnswer: string) => {
    await httpClient.resetPassword({
      name,
      secretAnswer,
      password,
    })
  }

  const updateReduxState = (password: string) => {
    reduxDispatch(editUser({ password }))
  }

  const onConfirm = async () => {
    setErrorsVisible(true)

    if (!isValid) {
      return
    }

    //  if no appToken and isGuest, just change locally, no http request
    const onlyChangeLocally = !appToken && currentUser.isGuest

    // Temporarily save new password locally as _alt, and preserve old password
    const altPasswordSaved = await changeLocalPassword(
      currentUser.id,
      formattedSecret,
      formattedPassword,
      onlyChangeLocally,
    )

    if (!altPasswordSaved || onlyChangeLocally) {
      await commitAltPassword(currentUser.id)
      toggleVisible()
      successAlert()
      return
    }

    try {
      await sendRequest(formattedPassword, formattedSecret)
      // Commit to new password locally, overwrite old password, remove _alt
      await commitAltPassword(currentUser.id)
      updateReduxState(formattedPassword)
      toggleVisible()
      successAlert()
    } catch (error) {
      // Revert back to old password
      deleteAltPassword(currentUser.id)
      failAlert()
    }
  }

  // Reset
  React.useEffect(() => {
    setSecret('')
    setNewPassword('')
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
          value={secret}
          onChangeText={setSecret}
          placeholder="secret_answer"
          secureTextEntry={true}
        />
        <Input
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="new_password"
          secureTextEntry={true}
          errors={errors}
          errorKeys={['password_too_short']}
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

const validate = (password: string) => {
  const errors: string[] = []
  let isValid = true

  if (password.length < 3) {
    isValid = false
    errors.push('password_too_short')
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
