import React from 'react'
import { TextInput } from '../../../components/common/TextInput'
import { useMultiStepForm, formActions } from '../../../components/common/MultiStepForm'
import { httpClient } from '../../../services/HttpClient'
import { ForgotPasswordFormLayout } from './ForgotPasswordFormLayout'
import _ from 'lodash'
import {
  decrypt,
  encrypt,
  formatPassword,
  hash,
  validatePassword,
  verifyStoreCredentials,
} from '../../../services/auth'
import { useSelector } from '../../../redux/useSelector'
import * as actions from '../../../redux/actions'
import * as selectors from '../../../redux/selectors'
import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'

export function AskNewPassword({ step }) {
  const [{ app: state }, dispatch] = useMultiStepForm()

  const reduxDispatch = useDispatch()
  const storeCredentials = useSelector(selectors.storeCredentialsSelector)

  const [repeatPassword, setRepeatPassword] = React.useState(state.password)
  const passwordIsValid = validatePassword(state.password)

  const repeatIsValid = validatePassword(repeatPassword)
  const pairIsEqual = repeatPassword === state.password
  const passwordPairIsValid = passwordIsValid && repeatIsValid && pairIsEqual

  const onSubmit = async () => {
    if (!passwordPairIsValid) {
      return
    }

    const storeSecretCorrect = verifyStoreCredentials({
      username: state.name,
      password: state.secretAnswer,
      storeCredentials,
      method: 'answer',
    })

    if (!storeSecretCorrect) {
      return
    }

    try {
      // Attempt encryption before API request, incase an error occurs
      const usernameHash = hash(state.name)
      const credentials = storeCredentials[usernameHash]

      const secretKey = decrypt(credentials.secretKeyEncryptedWithAnswer, state.secretAnswer)

      const password = formatPassword(repeatPassword)
      const secretKeyEncryptedWithPassword = encrypt(secretKey, password)

      const passwordSalt = uuidv4()
      const passwordHash = hash(password + passwordSalt)

      // API request
      await httpClient.resetPassword({
        name: state.name,
        secretAnswer: formatPassword(state.secretAnswer),
        password: formatPassword(state.password),
      })

      // Update redux AFTER successful API request
      reduxDispatch(
        actions.editPassword({
          usernameHash,
          passwordSalt,
          passwordHash,
          secretKeyEncryptedWithPassword,
        }),
      )

      dispatch({ formAction: formActions.goToStep('completed') })
    } catch (err) {
      dispatch({
        type: 'wrong-secret-answer',
        errorMessage: 'wrong_old_secret_answer',
        formAction: formActions.goToStep('ask-secret-answer'),
      })
    }
  }

  return (
    <ForgotPasswordFormLayout onSubmit={onSubmit}>
      <TextInput
        style={{ marginBottom: 5, marginTop: 20 }}
        onChange={(password) => dispatch({ type: 'change-password', password })}
        label="password"
        secureTextEntry={true}
        isValid={passwordIsValid}
        hasError={!passwordIsValid}
        value={state.password}
      />
      <TextInput
        style={{ marginBottom: 5 }}
        onChange={setRepeatPassword}
        label="confirm_password"
        secureTextEntry={true}
        isValid={passwordPairIsValid}
        hasError={!passwordPairIsValid}
        value={repeatPassword}
      />
    </ForgotPasswordFormLayout>
  )
}
