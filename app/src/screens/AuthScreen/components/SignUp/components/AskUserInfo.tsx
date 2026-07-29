import React from 'react'
import { Alert } from 'react-native'
import { useSignUp } from '../SignUpContext'
import { Input } from '../../../../../components/Input'
import { SegmentControl } from '../../../../../components/SegmentControl'
import { InfoButton } from '../../../../../components/InfoButton'
import { AuthCardBody } from '../../AuthCardBody'
import { useAccessibilityLabel } from '../../../../../hooks/useAccessibilityLabel'
import { useTranslate } from '../../../../../hooks/useTranslate'
import { genders } from '../../../../../optional/misc'

export const AskUserInfo = () => {
  const { state, dispatch, errors } = useSignUp()
  const translate = useTranslate()

  const getAccessibilityLabel = useAccessibilityLabel()
  const label = getAccessibilityLabel('name_info_label')

  // Warn before the password is typed: a password saved to the phone's password manager can be
  // autofilled by anyone using this phone, letting them into the account.
  React.useEffect(() => {
    Alert.alert(translate('password_manager_warning_title'), translate('password_manager_warning'))
  }, [])

  const onChangeName = (value: string) => {
    dispatch({ type: 'name', value })
  }

  const onChangeGender = (value: string) => {
    dispatch({ type: 'gender', value })
  }

  const onChangePassword = (value: string) => {
    dispatch({ type: 'password', value })
  }

  const onChangeConfirmPassword = (value: string) => {
    dispatch({ type: 'passwordConfirm', value })
  }

  return (
    <AuthCardBody>
      <Input
        value={state.name}
        onChangeText={onChangeName}
        placeholder="name"
        errors={errors}
        errorKeys={['username_too_short', 'name_taken_error']}
        errorsVisible={state.errorsVisible}
        actionLeft={
          <InfoButton title={'name'} content={'name_info_label'} accessibilityLabel={label} />
        }
      />
      <SegmentControl
        label={'your_gender'}
        options={genders}
        selected={state.gender}
        onSelect={onChangeGender}
      />
      <Input
        value={state.password}
        onChangeText={onChangePassword}
        placeholder="password"
        secureTextEntry={true}
        errors={errors}
        errorKeys={['password_too_short']}
        errorsVisible={state.errorsVisible}
        actionLeft={
          <InfoButton title={'password_error_heading'} content={'password_error_content'} />
        }
      />
      <Input
        value={state.passwordConfirm}
        onChangeText={onChangeConfirmPassword}
        placeholder="confirm_password"
        secureTextEntry={true}
        errors={errors}
        errorKeys={['passcodes_mismatch']}
        errorsVisible={state.errorsVisible}
      />
    </AuthCardBody>
  )
}
