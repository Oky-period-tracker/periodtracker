import React from 'react'
import { WheelPickerOption } from '../components/WheelPicker'
import { countries } from '../resources/translations'
import { useLocale } from './useLocale'

export const useCountryOptions = (): WheelPickerOption[] => {
  const locale = useLocale()

  const countryOptions = React.useMemo(() => {
    return Object.entries(countries).map(([key, item]) => ({
      label: item?.[locale],
      value: key,
    }))
  }, [countries, locale])

  return countryOptions
}
