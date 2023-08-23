import React from 'react'
import { ActivityIndicator } from 'react-native'
import styled from 'styled-components/native'
import { Text } from '../../../components/common/Text'
import { TextInput } from '../../../components/common/TextInput'
import { useMultiStepForm, formActions } from '../../../components/common/MultiStepForm'
import { httpClient } from '../../../services/HttpClient'
import { ForgotPasswordFormLayout } from './ForgotPasswordFormLayout'

export function AskName({ step }) {
  const [{ app: state }, dispatch] = useMultiStepForm()

  const onSubmit = async () => {
    dispatch({ type: 'fetch-request' })
    let errorMessage = 'empty'
    try {
      const { secretQuestion } = await httpClient.getUserInfo(state.name)
      dispatch({
        type: 'fetch-success',
        data: { secretQuestion },
        formAction: formActions.goToStep('ask-secret-answer'),
      })
    } catch (error) {
      // @TODO: add translation
      errorMessage =
        error.response && error.response.status === 404 ? 'user_not_found' : error.message
      errorMessage = error.message === 'Network Error' && 'request_fail'

      dispatch({ type: 'fetch-failure', errorMessage })
    }
  }

  if (state.isLoading) {
    return <ActivityIndicator />
  }

  return (
    <ForgotPasswordFormLayout onSubmit={onSubmit}>
      <Row>
        <TextInput
          style={{ marginTop: 20 }}
          onChange={(name) => dispatch({ type: 'change-name', name })}
          label="name"
          value={state.name}
        />
      </Row>
      {state.errorMessage && <ErrorMessage>{state.errorMessage}</ErrorMessage>}
    </ForgotPasswordFormLayout>
  )
}

const Row = styled.View`
  width: 80%;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin-bottom: 10px;
`
const ErrorMessage = styled(Text)`
  font-size: 14;
  margin-top: 20px;
  margin-bottom: 20px;
  color: red;
`
