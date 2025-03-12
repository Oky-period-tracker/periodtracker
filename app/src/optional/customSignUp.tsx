/* eslint-disable @typescript-eslint/no-var-requires */
import { SignUpState } from '../screens/AuthScreen/components/SignUp/SignUpContext'

// The component to ask a custom question
let AskCustom = () => {
  return null
}

// When is the custom question asked
// eg 2 places it after asking for username & password
let customStepIndex = 2

// Translations
let customSignUpTranslations = {}

// Check that the user entered their info correctly before they can continue
let validateCustomStep = ({
  errors,
  isValid,
}: {
  state: SignUpState
  errors: string[]
  isValid: boolean
}) => ({ errors, isValid })

let CUSTOM_SIGN_UP_ENABLED = false

try {
  const customSignUp = require('../resources/features/customSignUp')

  AskCustom = customSignUp.AskCustom
  customSignUpTranslations = customSignUp.customSignUpTranslations

  // customStepIndex can be omitted from the submodule
  if (customSignUp.customStepIndex !== undefined) {
    customStepIndex = customSignUp.customStepIndex
  }

  // validateCustomStep can be omitted from the submodule
  if (customSignUp.validateCustomStep !== undefined) {
    validateCustomStep = customSignUp.validateCustomStep
  }

  CUSTOM_SIGN_UP_ENABLED = true
} catch (e) {
  //
}

export {
  CUSTOM_SIGN_UP_ENABLED,
  AskCustom,
  customSignUpTranslations,
  customStepIndex,
  validateCustomStep,
}
