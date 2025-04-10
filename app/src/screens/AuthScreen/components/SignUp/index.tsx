import React from 'react'
import { AskAgree } from './components/AskAgree'
import { AuthHeader } from '../AuthHeader'
import { Hr } from '../../../../components/Hr'
import { SignUpProvider, SignUpStep, useSignUp } from './SignUpContext'
import { SignUpConfirmButton } from './components/SignUpConfirmButton'
import { AskAge } from './components/AskAge'
import { AskUserInfo } from './components/AskUserInfo'
import { AskSecret } from './components/AskSecret'
import { AskLocation } from './components/AskLocation'
import { AskCustom } from '../../../../optional/customSignUp'

export const SignUp = () => {
  return (
    <SignUpProvider>
      <SignUpInner />
    </SignUpProvider>
  )
}

const SignUpInner = () => {
  const { step } = useSignUp()
  const StepComponent = stepComponents[step] || React.Fragment

  return (
    <>
      <AuthHeader title={'sign_up'} />
      <StepComponent />
      <Hr />
      <SignUpConfirmButton />
    </>
  )
}

const stepComponents: Record<SignUpStep, React.FC> = {
  confirmation: AskAgree,
  information: AskUserInfo,
  secret: AskSecret,
  age: AskAge,
  location: AskLocation,
  custom: AskCustom,
}
