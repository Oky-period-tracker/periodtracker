import { useDispatch } from 'react-redux'
import { useSelector } from '../redux/useSelector'
import { setAvatar, setLocale, setTheme } from '../redux/actions'
import { appTranslations, defaultAvatar, defaultTheme } from '../resources/translations'
import { assets } from '../resources/assets'
import React from 'react'
import { initialLocale } from './useTranslate'

// Checks settings are valid, if not sets them to the default values
export const useValidSettingsEffect = () => {
  const dispatch = useDispatch()

  // Dont use currentXyzSelector because they also have a safety mechanism
  const locale = useSelector((s) => s.app.locale)
  const avatar = useSelector((s) => s.app.avatar)
  const theme = useSelector((s) => s.app.theme)

  const locales = Object.keys(appTranslations)
  const avatars = Object.keys(assets.avatars)
  const themes = Object.keys(assets.backgrounds)

  React.useEffect(() => {
    if (!locales.includes(locale)) {
      dispatch(setLocale(initialLocale))
    }
    if (!avatars.includes(avatar)) {
      dispatch(setAvatar(defaultAvatar))
    }
    if (!themes.includes(theme)) {
      dispatch(setTheme(defaultTheme))
    }
  }, [locale, locales, avatar, avatars, theme, themes])
}
