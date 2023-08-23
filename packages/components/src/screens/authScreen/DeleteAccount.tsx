import React from 'react'
import { MultiStepForm } from '../../components/common/MultiStepForm'
import { AskName } from './deleteAccount/AskName'
import { AskPassword } from './deleteAccount/AskPassword'
import { DeleteSuccess } from './deleteAccount/DeleteSuccess'

const initialState = {
  name: '',
  password: '',
  errorMessage: null,
  isLoading: false,
}

export function DeleteAccount({ toggle, setContentState }) {
  return (
    <MultiStepForm
      initialStep={'ask-name'}
      appReducer={(state = initialState, action) => {
        if (action.type === 'change-name') {
          return { ...state, name: action.name }
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

        if (action.type === 'wrong-password') {
          return { ...state, errorMessage: action.errorMessage }
        }

        return state
      }}
    >
      <AskName step={'ask-name'} />
      <AskPassword step={'ask-password'} />
      <DeleteSuccess step={'completed'} {...{ toggle, setContentState }} />
    </MultiStepForm>
  )
}
