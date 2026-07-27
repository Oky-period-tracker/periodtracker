import React from 'react'
import { Button, ButtonProps } from './Button'
import { WheelPickerModal } from './WheelPickerModal'
import { useSelector } from '../redux/useSelector'
import { currentLocaleSelector } from '../redux/selectors'
import { availableAppLocales } from '../resources/translations'
import { useDispatch } from 'react-redux'
import { setLocale } from '../redux/actions'
import { WheelPickerOption } from './WheelPicker'
import { analytics } from '../services/firebase'
import { getActiveBundle } from '../redux/storeManager'
import { ANON_USER_ID } from '../services/storage/storageKeys'
import { setPendingLocale } from '../services/auth/pendingLocale'

export const LanguageSelector = (props: ButtonProps) => {
  const locale = useSelector(currentLocaleSelector)
  const dispatch = useDispatch()

  const onSelect = (option?: WheelPickerOption) => {
    if (!option) {
      return
    }

    dispatch(setLocale(option.value))

    // When picked on the logged-out auth screen (anon store), remember it as an explicit choice so
    // it carries into the account the user logs into next instead of being overridden by that
    // account's saved language.
    if (getActiveBundle()?.userId === ANON_USER_ID) {
      setPendingLocale(option.value)
    }

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
