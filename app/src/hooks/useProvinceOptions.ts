import React from 'react'
import { WheelPickerOption } from '../components/WheelPicker'
import { provinces } from '../resources/translations'
import { useLocale } from './useLocale'

export const useProvinceOptions = (country: string | undefined): WheelPickerOption[] => {
  const locale = useLocale()

  const provinceOptions = React.useMemo(() => {
    const countryCode = country ? country : null

    const filteredProvinces = provinces.filter(({ code, uid }) => code === countryCode || uid === 0)

    return filteredProvinces.map((item) => ({
      label: item?.[locale],
      value: item.uid.toString(),
    }))
  }, [country, provinces, locale])

  return provinceOptions
}
