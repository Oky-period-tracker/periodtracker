import React from 'react'
import { User } from '../../../../types'
import { FAST_SIGN_UP } from '../../../../config/env'
import { useAuthMode } from '../../AuthModeContext'
import { useDispatch } from 'react-redux'
import { createAccountRequest } from '../../../../redux/actions'
import { formatPassword } from '../../../../services/auth'
import { uuidv4 } from '../../../../services/uuid'
import moment from 'moment'
import { httpClient } from '../../../../services/HttpClient'
import { useDebounce } from '../../../../hooks/useDebounce'
import {
  CUSTOM_SIGN_UP_ENABLED,
  customStepIndex,
  validateCustomStep,
} from '../../../../optional/customSignUp'

export type SignUpStep = 'confirmation' | 'information' | 'secret' | 'age' | 'location' | 'custom'

const steps: SignUpStep[] = ['confirmation', 'information', 'secret', 'age', 'location']

export type SignUpState = Omit<User, 'id' | 'dateSignedUp' | 'isGuest' | 'country' | 'province'> & {
  stepIndex: number
  agree: boolean
  nameAvailable: boolean
  passwordConfirm: string
  month?: number
  year?: number
  errorsVisible: boolean
  // Make required User properties optional for state
  country?: User['country']
  province?: User['province']
}

type Action<T extends keyof SignUpState = keyof SignUpState> =
  | {
      type: T
      value: SignUpState[T]
    }
  | {
      type: 'continue'
    }

const defaultState: SignUpState = {
  stepIndex: 0,
  agree: false,
  nameAvailable: true,
  errorsVisible: false,
  name: '',
  password: '',
  passwordConfirm: '',
  secretQuestion: '',
  secretAnswer: '',
  gender: 'Female',
  location: 'Urban',
  country: undefined,
  province: undefined,
  dateOfBirth: '',
  month: undefined,
  year: undefined,
  metadata: {
    isProfileUpdateSkipped: true, // Default true for new users
  },
}

const prefilledState: SignUpState = {
  stepIndex: 0,
  agree: true,
  nameAvailable: true,
  errorsVisible: false,
  name: 'aaa',
  password: 'aaa',
  passwordConfirm: 'aaa',
  secretQuestion: 'favourite_actor',
  secretAnswer: 'a',
  gender: 'Female',
  location: 'Urban',
  country: 'AF',
  province: '0',
  month: 1,
  year: 2016,
  dateOfBirth: '2015-12-31T17:00:00.000Z',
  metadata: {
    isProfileUpdateSkipped: true, // Default true for new users
  },
}

const initialState = FAST_SIGN_UP ? prefilledState : defaultState

const MINIMUM_NAME_LENGTH = 3

function reducer(state: SignUpState, action: Action): SignUpState {
  switch (action.type) {
    case 'continue': {
      const step = steps[state.stepIndex]
      const { isValid } = validateStep(state, step)

      if (!isValid) {
        return {
          ...state,
          errorsVisible: true,
        }
      }

      return {
        ...state,
        stepIndex: state.stepIndex + 1,
        errorsVisible: false,
      }
    }

    case 'month': {
      const month = action.value as number | undefined
      if (!state.year || month === undefined) {
        return {
          ...state,
          month,
        }
      }

      const dateOfBirth = getDateOfBirth(state.year, month)

      return {
        ...state,
        month,
        dateOfBirth,
      }
    }

    case 'year': {
      const year = action.value as number | undefined
      if (!year || state.month === undefined || isNaN(state.month)) {
        return {
          ...state,
          year,
        }
      }

      const dateOfBirth = getDateOfBirth(year, state.month)
      return {
        ...state,
        year,
        dateOfBirth,
      }
    }

    case 'country':
      return {
        ...state,
        country: action.value as string,
        province: '',
      }

    default:
      return {
        ...state,
        [action.type]: action.value,
      }
  }
}

const getDateOfBirth = (year: number, month: number) => {
  const day = 2 // Prevents it defaulting to 31st of previous month
  return new Date(year, month, day).toISOString()
}

const validateStep = (
  state: SignUpState,
  step: SignUpStep,
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  let isValid = true

  // ========== confirmation ========== //
  if (step === 'confirmation') {
    if (!state.agree) {
      isValid = false
    }
  }

  // ========== information ========== //
  if (step === 'information') {
    if (!state.nameAvailable) {
      isValid = false
      errors.push('name_taken_error')
    }

    if (state.name.length < MINIMUM_NAME_LENGTH) {
      isValid = false
      errors.push('username_too_short')
    }

    if (!state.gender) {
      isValid = false
      errors.push('no_gender')
    }

    if (state.password.length < 3) {
      isValid = false
      errors.push('password_too_short')
    }

    if (state.password !== state.passwordConfirm) {
      isValid = false
      errors.push('passcodes_mismatch')
    }
  }

  // ========== secret ========== //
  if (step === 'secret') {
    if (!state.secretQuestion) {
      isValid = false
    }

    if (state.secretAnswer.length < 1) {
      isValid = false
      errors.push('secret_too_short')
    }
  }

  // ========== age ========== //
  if (step === 'age') {
    if (!state.year) {
      isValid = false
    }

    if (state.month === undefined || isNaN(state.month)) {
      isValid = false
    }

    if (!state.dateOfBirth) {
      isValid = false
    }
  }

  // ========== location ========== //
  if (step === 'location') {
    if (!state.country) {
      isValid = false
      errors.push('no_country')
    }

    if (!state.province) {
      isValid = false
      errors.push('no_province')
    }

    if (!state.location) {
      isValid = false
      errors.push('no_location')
    }
  }

  // ========== custom ========== //
  if (step === 'custom') {
    return validateCustomStep({ state, isValid, errors })
  }

  return { isValid, errors }
}

type SignUpContext = {
  state: SignUpState
  dispatch: React.Dispatch<Action>
  step: SignUpStep
  isValid: boolean
  errors: string[]
}

const defaultValue: SignUpContext = {
  state: defaultState,
  dispatch: () => {
    //
  },
  step: steps[0],
  isValid: false,
  errors: [],
}

const SignUpContext = React.createContext<SignUpContext>(defaultValue)

export const SignUpProvider = ({ children }: React.PropsWithChildren) => {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const step = steps[state.stepIndex]
  const { isValid, errors } = validateStep(state, step)

  const { setAuthMode } = useAuthMode()

  const reduxDispatch = useDispatch()

  const [debouncedName] = useDebounce(state.name, 500)
  React.useEffect(() => {
    if (!debouncedName || debouncedName.length < MINIMUM_NAME_LENGTH) {
      return
    }

    let cleanup = false
    const checkUserNameAvailability = async () => {
      try {
        await httpClient.getUserInfo(debouncedName)
        if (cleanup) {
          return
        }
        // user does exist
        dispatch({ type: 'nameAvailable', value: false })
      } catch (err) {
        if (cleanup) {
          return
        }

        // user does not exist
        dispatch({ type: 'nameAvailable', value: true })
      }
    }
    checkUserNameAvailability()

    return () => {
      cleanup = true
    }
  }, [debouncedName])

  // Finish
  React.useEffect(() => {
    if (step) {
      return
    }

    if (!state.country || !state.province) {
      return
    }

    const user = {
      id: uuidv4(),
      name: state.name,
      password: formatPassword(state.password),
      secretQuestion: state.secretQuestion,
      secretAnswer: formatPassword(state.secretAnswer),
      gender: state.gender,
      location: state.location,
      country: state.country,
      province: state.province,
      dateOfBirth: state.dateOfBirth,
      metadata: state.metadata,
      dateSignedUp: moment.utc().toISOString(),
      isGuest: false,
    }

    reduxDispatch(createAccountRequest(user))
    // TODO: wait for success
    setAuthMode('avatar_and_theme')
  }, [step])

  React.useEffect(() => {
    if (CUSTOM_SIGN_UP_ENABLED && !steps.includes('custom')) {
      steps.splice(customStepIndex, 0, 'custom')
    }
  }, [CUSTOM_SIGN_UP_ENABLED, steps, customStepIndex])

  return (
    <SignUpContext.Provider
      value={{
        state,
        dispatch,
        step,
        isValid,
        errors,
      }}
    >
      {children}
    </SignUpContext.Provider>
  )
}

export const useSignUp = () => {
  return React.useContext(SignUpContext)
}
