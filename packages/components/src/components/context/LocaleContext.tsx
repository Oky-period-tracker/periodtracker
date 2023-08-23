import React from 'react'
import { useSelector } from '../../hooks/useSelector'
import { currentLocale, configureI18n } from '../../i18n'

export function LocaleProvider({ children }) {
  const locale = useSelector(state => state.app.locale)
  const [syncLocale, setSyncLocale] = React.useState(currentLocale())

  React.useLayoutEffect(() => {
    if (syncLocale !== locale) {
      configureI18n(locale)
      setSyncLocale(locale)
    }
  }, [locale, syncLocale])

  return <React.Fragment key={`lang-${syncLocale}`}>{children}</React.Fragment>
}
