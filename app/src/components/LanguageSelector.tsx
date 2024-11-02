import React from 'react'
import { Button, ButtonProps } from './Button'
import { WheelPickerModal } from './WheelPickerModal'
import { availableAppLocales } from '../resources/translations'
import { useDispatch } from 'react-redux'
import { setLocale } from '../redux/actions'
import { WheelPickerOption } from './WheelPicker'
import { analytics } from '../services/firebase'
import { useLocale } from '../hooks/useLocale'

export const LanguageSelector = (props: ButtonProps) => {
  const locale = useLocale()
  const dispatch = useDispatch()

  const onSelect = (option?: WheelPickerOption) => {
    if (!option) {
      return
    }

    dispatch(setLocale(option.value))

    analytics?.().logEvent('languageChanged', {
      selectedLanguage: option.value,
    })
  }

  const initialIndex = availableAppLocales.findIndex((item) => item === locale) ?? 0

  const options = React.useMemo(
    () =>
      availableAppLocales.map((item) => ({
        label: item,
        value: item,
      })),
    [availableAppLocales],
  )

  const initialOption = options[initialIndex]

  const LanguageButton = ({ onPress }: ButtonProps) => {
    return (
      <Button {...props} onPress={onPress}>
        {locale}
      </Button>
    )
  }

  return (
    <WheelPickerModal
      initialOption={initialOption}
      options={options}
      onSelect={onSelect}
      ToggleComponent={LanguageButton}
      enableTranslate
    />
  )
}
