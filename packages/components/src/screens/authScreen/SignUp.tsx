import React from 'react'
import { useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { MultiStepForm } from '../../components/common/MultiStepForm'
import { AskUserInformation } from './signUp/AskUserInformation'
import { AskPassword } from './signUp/AskPassword'
import { AskAge } from './signUp/AskAge'
import { AskLocation } from './signUp/AskLocation'
import { AskUserConfirmation } from './signUp/AskUserConfirmation'
import { navigate } from '../../services/navigationService'
import { commonActions } from '../../redux/actions'
import _ from 'lodash'
import { FAST_SIGN_UP } from '../../config'

const randomLetters = () => {
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  return `${letters[Math.floor(Math.random() * letters.length)]}${
    letters[Math.floor(Math.random() * letters.length)]
  }${letters[Math.floor(Math.random() * letters.length)]}${
    letters[Math.floor(Math.random() * letters.length)]
  }`
}

const fastSignUpInitialState = {
  name: randomLetters(),
  password: 'aaa',
  passwordConfirm: 'aaa',
  selectedQuestion: 'favourite_actor',
  answer: 'a',
  gender: 'Female',
  location: 'Urban',
  country: 'AF',
  province: '0',
  dateOfBirth: '2015-12-31T17:00:00.000Z',
}

const defaultState = {
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

const initialState = FAST_SIGN_UP ? fastSignUpInitialState : defaultState

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
      commonActions.createAccountRequest({
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
    navigate('AvatarAndThemeScreen', { signingUp: true, newUser: { gender } }) // @TODO: wait on isCreatingAccount
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
