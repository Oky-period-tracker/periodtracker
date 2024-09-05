import React from 'react'
import { useSignUp } from '../SignUpContext'
import { WheelPickerModal } from '../../../../../components/WheelPickerModal'
import { WheelPickerOption } from '../../../../../components/WheelPicker'
import { yearOptions } from '../../../../../config/options'
import { InfoButton } from '../../../../../components/InfoButton'
import { useMonths } from '../../../../../hooks/useMonths'
import { AuthCardBody } from '../../AuthCardBody'
import { useAccessibilityLabel } from '../../../../../hooks/useAccessibilityLabel'

export const AskAge = () => {
  const { state, dispatch } = useSignUp()
  const { months, monthOptions } = useMonths()

  const getAccessibilityLabel = useAccessibilityLabel()
  const label = getAccessibilityLabel('month_selector')

  const month = state.month !== undefined ? months[state.month] : undefined
  const year = state.year?.toString()

  const onChangeMonth = (option: WheelPickerOption | undefined) => {
    const index = monthOptions.findIndex((item) => item.value === option?.value)
    const value = index >= 0 ? index : undefined
    dispatch({ type: 'month', value })
  }

  const onChangeYear = (option: WheelPickerOption | undefined) => {
    const value = option ? parseInt(option?.value) : undefined
    dispatch({ type: 'year', value })
  }

  const initialMonth = monthOptions.find((item) => item.value === month)
  const initialYear = yearOptions.find((item) => item.value === year)

  return (
    <AuthCardBody>
      <WheelPickerModal
        initialOption={initialMonth}
        options={monthOptions}
        onSelect={onChangeMonth}
        placeholder={'month_of_birth'}
        accessibilityLabel={label}
        actionLeft={<InfoButton title={'birth_info_heading'} content={'birth_info'} />}
      />
      <WheelPickerModal
        initialOption={initialYear}
        options={yearOptions}
        onSelect={onChangeYear}
        placeholder={'year_of_birth'}
      />
    </AuthCardBody>
  )
}
