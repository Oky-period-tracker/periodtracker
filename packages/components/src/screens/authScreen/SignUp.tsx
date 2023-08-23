import React from 'react'
import { useDispatch } from 'react-redux'
import uuidv4 from 'uuid/v4'
import { MultiStepForm } from '../../components/common/MultiStepForm'
import { AskUserInformation } from './signUp/AskUserInformation'
import { AskPassword } from './signUp/AskPassword'
import { AskAge } from './signUp/AskAge'
import { AskLocation } from './signUp/AskLocation'
import { AskUserConfirmation } from './signUp/AskUserConfirmation'
import { navigate } from '../../services/navigationService'
import * as actions from '../../redux/actions'
import _ from 'lodash'

const initialState = {
  name: '',
  password: '',
  passwordConfirm: '',
  selectedQuestion: '',
  answer: '',
  gender: 'Female',
  location: 'Urban',
  country: null,
  province: null,
  dateOfBirth: '',
}

export function SignUp({ heightInner }) {
  const dispatch = useDispatch()

  const createAccount = ({
    name,
    dateOfBirth,
    gender,
    location,
    country,
    province,
    password,
    selectedQuestion,
    answer,
  }) => {
    dispatch(
      actions.createAccountRequest({
        id: uuidv4(),
        name,
        dateOfBirth,
        gender,
        location,
        country,
        province,
        password: _.toLower(password).trim(),
        secretQuestion: selectedQuestion,
        secretAnswer: _.toLower(answer).trim(),
      }),
    )
    navigate('AvatarAndThemeScreen', { signingUp: true }) // @TODO: wait on isCreatingAccount
  }
  return (
    <MultiStepForm
      initialStep={'ask-user-confirmation'}
      appReducer={(state = initialState, action) => {
        if (action.type === 'change-form-data') {
          return { ...state, [action.inputName]: action.value }
        }

        return state
      }}
    >
      <AskUserConfirmation step={'ask-user-confirmation'} heightInner={heightInner} />
      <AskUserInformation step={'ask-user-information'} heightInner={heightInner} />
      <AskPassword step={'ask-password'} heightInner={heightInner} />
      <AskAge step={'ask-age'} heightInner={heightInner} />
      <AskLocation step={'ask-location'} createAccount={createAccount} />
    </MultiStepForm>
  )
}
