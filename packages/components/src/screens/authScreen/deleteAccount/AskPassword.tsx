import React from 'react'
import styled from 'styled-components/native'
import { Text } from '../../../components/common/Text'
import { TextInput } from '../../../components/common/TextInput'
import { useMultiStepForm, formActions } from '../../../components/common/MultiStepForm'
import { DeleteFormLayout } from './DeleteFormLayout'
import { httpClient } from '../../../services/HttpClient'
import _ from 'lodash'

export function AskPassword({ step }) {
  const [{ app: state }, dispatch] = useMultiStepForm()
  const onSubmit = async () => {
    try {
      await httpClient.deleteUserFromPassword({
        name: state.name,
        password: _.toLower(state.password).trim(),
      })
      dispatch({ formAction: formActions.goToStep('completed') })
    } catch (error) {
      let errorMessage = 'empty'
      if (error.response.data.message === 'Wrong password for deletion') {
        errorMessage = 'password_incorrect'
      }

      dispatch({
        type: 'wrong-password',
        errorMessage,
        formAction: formActions.goToStep('ask-password'),
      })
    }
  }
  return (
    <DeleteFormLayout onSubmit={onSubmit}>
      <TextInput
        onChange={(password) => dispatch({ type: 'change-password', password })}
        label="password"
        value={state.password}
      />
      <WarningContainer>
        <Text>delete_account_description</Text>
      </WarningContainer>
      {state.errorMessage && <ErrorMessage>{state.errorMessage}</ErrorMessage>}
    </DeleteFormLayout>
  )
}

const ErrorMessage = styled(Text)`
  font-size: 14;
  margin-top: 20px;
  margin-bottom: 20px;
  color: red;
`
const WarningContainer = styled.View`
  width: 80%;
  justify-content: center;
  align-items: center;
`
