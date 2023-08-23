import React from 'react'
import { ForgotPasswordFormLayout } from './ForgotPasswordFormLayout'
import { Text } from '../../../components/common/Text'
import { Icon } from '../../../components/common/Icon'
import { assets } from '../../../assets/index'
import { BackOneScreen } from '../../../services/navigationService'
import styled from 'styled-components/native'

export function ResetPasswordSuccess({ step, toggle, setContentState }) {
  const onSubmit = () => {
    toggle()
    setContentState(0)
  }
  return (
    <ForgotPasswordFormLayout onSubmit={onSubmit}>
      <QuestionText>forgot_password_completed</QuestionText>
      <Icon
        source={assets.static.icons.tick}
        style={{ alignItems: 'center', justifyContent: 'center' }}
      />
    </ForgotPasswordFormLayout>
  )
}

const QuestionText = styled(Text)`
  font-size: 16;
  margin-top: 20px;
  margin-bottom: 20px;
`
