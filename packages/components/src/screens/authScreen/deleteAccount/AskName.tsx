import React from 'react'
import { ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'
import { Text } from '../../../components/common/Text'
import { TextInput } from '../../../components/common/TextInput'
import { useMultiStepForm, formActions } from '../../../components/common/MultiStepForm'
import { httpClient } from '../../../services/HttpClient'
import { DeleteFormLayout } from './DeleteFormLayout'

export function AskName({ step }) {
  const [{ app: state }, dispatch] = useMultiStepForm()

  const onSubmit = async () => {
    dispatch({ type: 'fetch-request' })

    try {
      await httpClient.getUserInfo(state.name.trim())
      dispatch({
        type: 'fetch-success',
        formAction: formActions.goToStep('ask-password'),
      })
    } catch (error) {
      let errorMessage = 'empty'
      if (error.response && error.response.status && error.message) {
        errorMessage = error.response.status === 404 && 'user_not_found'
        errorMessage = error.message === 'Network Error' && 'request_fail'
      }
      if (error.response.data.message === 'User not found') {
        errorMessage = 'user_not_found'
      }
      dispatch({ type: 'fetch-failure', errorMessage })
    }
  }

  if (state.isLoading) {
    return <ActivityIndicator />
  }

  return (
    <DeleteFormLayout onSubmit={onSubmit}>
      <TextInput
        style={{ marginTop: 20 }}
        onChange={(name) => dispatch({ type: 'change-name', name })}
        label="name"
        value={state.name}
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
