import React from 'react'
import { DeleteFormLayout } from './DeleteFormLayout'
import { Text } from '../../../components/common/Text'
import { Icon } from '../../../components/common/Icon'
import { assets } from '../../../assets/index'
import styled from 'styled-components/native'

export function DeleteSuccess({ step, toggle, setContentState }) {
  const onSubmit = () => {
    toggle()
    setContentState(0)
  }
  return (
    <DeleteFormLayout onSubmit={onSubmit}>
      <QuestionText>delete_account_completed</QuestionText>
      <Icon
        source={assets.static.icons.tick}
        style={{ alignItems: 'center', justifyContent: 'center' }}
      />
    </DeleteFormLayout>
  )
}

const QuestionText = styled(Text)`
  font-size: 16;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
`
