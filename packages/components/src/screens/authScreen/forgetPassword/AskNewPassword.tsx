import React from 'react'
import { TextInput } from '../../../components/common/TextInput'
import { useMultiStepForm, formActions } from '../../../components/common/MultiStepForm'
import { httpClient } from '../../../services/HttpClient'
import { ForgotPasswordFormLayout } from './ForgotPasswordFormLayout'
import _ from 'lodash'

export function AskNewPassword({ step }) {
  const [{ app: state }, dispatch] = useMultiStepForm()

  const minPasswordLength = 1
  const [repeatPassword, setRepeatPassword] = React.useState(state.password)
  const passwordIsValid = state.password.length >= minPasswordLength

  const onSubmit = async () => {
    if (!passwordIsValid) {
      return
    }
    if (!repeatPassword) {
      return
    }
    try {
      await httpClient.resetPassword({
        name: state.name,
        secretAnswer: _.toLower(state.secretAnswer).trim(),
        password: _.toLower(state.password).trim(),
      })

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
        onChange={password => dispatch({ type: 'change-password', password })}
        label="password"
        secureTextEntry={true}
        isValid={passwordIsValid}
        hasError={state.password >= minPasswordLength && !passwordIsValid}
        value={state.password}
      />
      <TextInput
        style={{ marginBottom: 5 }}
        onChange={setRepeatPassword}
        label="confirm_password"
        secureTextEntry={true}
        isValid={repeatPassword.length >= minPasswordLength && repeatPassword === state.password}
        hasError={repeatPassword.length >= minPasswordLength && repeatPassword !== state.password}
        value={repeatPassword}
      />
    </ForgotPasswordFormLayout>
  )
}
