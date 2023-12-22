import React from 'react'
import { useCommonSelector } from '../../redux/common/useCommonSelector'
import { currentLocale, configureI18n } from '../../i18n'

export function LocaleProvider({ children }) {
  const locale = useCommonSelector((state) => state.app.locale)
  const [syncLocale, setSyncLocale] = React.useState(currentLocale())

  React.useLayoutEffect(() => {
    if (syncLocale !== locale) {
      configureI18n(locale)
      setSyncLocale(locale)
    }
  }, [locale, syncLocale])

  return <React.Fragment key={`lang-${syncLocale}`}>{children}</React.Fragment>
}
