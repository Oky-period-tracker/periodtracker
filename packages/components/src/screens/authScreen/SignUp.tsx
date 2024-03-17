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
import * as actions from '../../redux/actions'
import _ from 'lodash'
import { FAST_SIGN_UP } from '../../config'
import { User } from '../../redux/reducers/authReducer'

type SignUpState = Omit<User, 'id' | 'dateSignedUp' | 'isGuest'> & {
  passwordConfirm: string
}

const randomLetters = () => {
  const letters = 'abcdefghijklmnopqrstuvwxyz'
  return `${letters[Math.floor(Math.random() * letters.length)]}${
    letters[Math.floor(Math.random() * letters.length)]
  }${letters[Math.floor(Math.random() * letters.length)]}${
    letters[Math.floor(Math.random() * letters.length)]
  }`
}

const fastSignUpInitialState: SignUpState = {
  name: randomLetters(),
  password: 'aaa',
  passwordConfirm: 'aaa',
  secretQuestion: 'favourite_actor',
  secretAnswer: 'a',
  gender: 'Female',
  location: 'Urban',
  country: 'AF',
  province: '0',
  dateOfBirth: '2015-12-31T17:00:00.000Z',
}

const defaultState: SignUpState = {
  name: '',
  password: '',
  passwordConfirm: '',
  secretQuestion: '',
  secretAnswer: '',
  gender: 'Female',
  location: 'Urban',
  country: null,
  province: null,
  dateOfBirth: '',
  //
  genderIdentity: null,
  isPwd: 'No',
  accommodationRequirement: null,
  religion: 'undisclosed_religion',
  encyclopediaVersion: 'No',
  city: '',
}

const initialState = FAST_SIGN_UP ? fastSignUpInitialState : defaultState

export function SignUp({ heightInner }) {
  const dispatch = useDispatch()

  const createAccount = (user: User) => {
    dispatch(
      actions.createAccountRequest({
        id: uuidv4(),

        ...user,
      }),
    )
    navigate('AvatarAndThemeScreen', { signingUp: true, newUser: { gender: user.gender } }) // @TODO: wait on isCreatingAccount
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
