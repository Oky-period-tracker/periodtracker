import React from 'react'
import { MultiStepForm } from '../../components/common/MultiStepForm'
import { AskName } from './forgetPassword/AskName'
import { AskSecretAnswer } from './forgetPassword/AskSecretAnswer'
import { AskNewPassword } from './forgetPassword/AskNewPassword'
import { ResetPasswordSuccess } from './forgetPassword/ResetPasswordSuccess'

const initialState = {
  name: '',
  secretAnswer: '',
  password: '',
  secretQuestion: null,
  errorMessage: null,
  isLoading: false,
}

export function ForgotPassword({ toggle, setContentState }) {
  return (
    <MultiStepForm
      initialStep={'ask-name'}
      appReducer={(state = initialState, action) => {
        if (action.type === 'change-name') {
          return { ...state, name: action.name }
        }

        if (action.type === 'change-secret-answer') {
          return { ...state, secretAnswer: action.secretAnswer }
        }

        if (action.type === 'change-password') {
          return { ...state, password: action.password }
        }

        if (action.type === 'fetch-request') {
          return { ...state, errorMessage: null, isLoading: true }
        }

        if (action.type === 'fetch-success') {
          return { ...state, ...action.data, isLoading: false }
        }

        if (action.type === 'fetch-failure') {
          return { ...state, errorMessage: action.errorMessage, isLoading: false }
        }

        if (action.type === 'wrong-secret-answer') {
          return { ...state, errorMessage: action.errorMessage }
        }

        return state
      }}
    >
      <AskName step={'ask-name'} />
      <AskSecretAnswer step={'ask-secret-answer'} />
      <AskNewPassword step={'ask-new-password'} />
      <ResetPasswordSuccess step={'completed'} {...{ toggle, setContentState }} />
    </MultiStepForm>
  )
}
