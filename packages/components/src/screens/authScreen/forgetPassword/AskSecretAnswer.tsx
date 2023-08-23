import React from 'react'
import styled from 'styled-components/native'
import { Text } from '../../../components/common/Text'
import { TextInput } from '../../../components/common/TextInput'
import { useMultiStepForm, formActions } from '../../../components/common/MultiStepForm'
import { ForgotPasswordFormLayout } from './ForgotPasswordFormLayout'

export function AskSecretAnswer({ step }) {
  const [{ app: state }, dispatch] = useMultiStepForm()
  const onSubmit = () => dispatch({ formAction: formActions.goToStep('ask-new-password') })

  return (
    <ForgotPasswordFormLayout onSubmit={onSubmit}>
      <TextInput
        onChange={(secretAnswer) => dispatch({ type: 'change-secret-answer', secretAnswer })}
        label="secret_answer"
        value={state.secretAnswer}
      />
      {state.errorMessage && <ErrorMessage>{state.errorMessage}</ErrorMessage>}
    </ForgotPasswordFormLayout>
  )
}

const QuestionText = styled(Text)`
  font-size: 16;
  margin-top: 20px;
  margin-bottom: 20px;
`

const ErrorMessage = styled(Text)`
  font-size: 14;
  margin-top: 20px;
  margin-bottom: 20px;
  color: red;
`
