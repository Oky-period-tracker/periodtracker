import React from 'react'
import { useSignUp } from '../SignUpContext'
import { WheelPickerModal } from '../../../../../components/WheelPickerModal'
import { SegmentControl } from '../../../../../components/SegmentControl'
import { WheelPickerOption, useInitialWheelOption } from '../../../../../components/WheelPicker'
import { useProvinceOptions } from '../../../../../hooks/useProvinceOptions'
import { useCountryOptions } from '../../../../../hooks/useCountryOptions'
import { AuthCardBody } from '../../AuthCardBody'
import { useAccessibilityLabel } from '../../../../../hooks/useAccessibilityLabel'
import { locations } from '../../../../../config/options'

export const AskLocation = () => {
  const { state, dispatch } = useSignUp()

  const getAccessibilityLabel = useAccessibilityLabel()
  const label = getAccessibilityLabel('search_country')

  const onChangeCountry = (option: WheelPickerOption | undefined) => {
    dispatch({ type: 'country', value: option?.value })
  }

  const onChangeProvince = (option: WheelPickerOption | undefined) => {
    dispatch({ type: 'province', value: option?.value })
  }

  const onChangeLocation = (value: string) => {
    dispatch({ type: 'location', value })
  }

  const countryOptions = useCountryOptions()
  const provinceOptions = useProvinceOptions(state.country)

  const initialCountry = useInitialWheelOption(state.country, countryOptions, true)
  const initialProvince = useInitialWheelOption(state.province, provinceOptions)

  const onlyOneCountry = countryOptions.length === 1

  React.useEffect(() => {
    if (onlyOneCountry && !state.country) {
      onChangeCountry(initialCountry)
    }
  }, [onlyOneCountry, state.country, initialCountry])

  return (
    <AuthCardBody>
      <WheelPickerModal
        initialOption={initialCountry}
        options={countryOptions}
        onSelect={onChangeCountry}
        placeholder={'country'}
        accessibilityLabel={label}
        disabled={onlyOneCountry}
        searchEnabled
      />
      <WheelPickerModal
        initialOption={initialProvince}
        options={provinceOptions}
        onSelect={onChangeProvince}
        placeholder={'province'}
        searchEnabled
      />
      <SegmentControl
        label={'location'}
        options={locations}
        selected={state.location}
        onSelect={onChangeLocation}
      />
    </AuthCardBody>
  )
}
