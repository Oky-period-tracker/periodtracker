import React from 'react'
import { WheelPickerOption } from '../components/WheelPicker'
import { useSelector } from '../redux/useSelector'
import { currentLocaleSelector } from '../redux/selectors'
import { Locale } from 'expo-localization'
import { provinces } from '../core/modules/translations'

export const useProvinceOptions = (country: string | undefined): WheelPickerOption[] => {
  const locale = (useSelector(currentLocaleSelector) as unknown) as Locale // TODO:

  const provinceOptions = React.useMemo(() => {
    const countryCode = country ? country : null

    const filteredProvinces = provinces.filter(({ code, uid }) => code === countryCode || uid === 0)

    return filteredProvinces.map((item) => ({
      // @ts-expect-error TODO:
      label: item[locale],
      value: item.uid.toString(),
    }))
  }, [country, provinces, locale])

  return provinceOptions
}
