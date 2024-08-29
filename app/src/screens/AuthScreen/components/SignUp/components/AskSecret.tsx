import React from 'react'
import { useSignUp } from '../SignUpContext'
import { Input } from '../../../../../components/Input'
import { WheelPickerModal } from '../../../../../components/WheelPickerModal'
import { WheelPickerOption } from '../../../../../components/WheelPicker'
import { questionOptions } from '../../../../../config/options'
import { InfoButton } from '../../../../../components/InfoButton'
import { AuthCardBody } from '../../AuthCardBody'

export const AskSecret = () => {
  const { state, dispatch, errors } = useSignUp()

  const onChangeAnswer = (value: string) => {
    dispatch({ type: 'secretAnswer', value })
  }

  const onChangeQuestion = (option: WheelPickerOption | undefined) => {
    if (!option) {
      return
    }
    const value = option.value
    dispatch({ type: 'secretQuestion', value })
  }

  const initialSecretOption = questionOptions.find((item) => item.value === state.secretQuestion)

  return (
    <AuthCardBody>
      <WheelPickerModal
        initialOption={initialSecretOption}
        options={questionOptions}
        onSelect={onChangeQuestion}
        placeholder={'secret_question'}
        allowUndefined={false}
        enableTranslate
        actionLeft={<InfoButton title={'secret_q_error_heading'} content={'secret_que_info'} />}
      />
      <Input
        value={state.secretAnswer}
        onChangeText={onChangeAnswer}
        placeholder="secret_answer"
        errors={errors}
        errorKeys={['secret_too_short']}
        errorsVisible={state.errorsVisible}
        actionLeft={<InfoButton title={'secret_error_heading'} content={'secret_error_content'} />}
      />
    </AuthCardBody>
  )
}
