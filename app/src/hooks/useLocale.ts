import { useSelector } from 'react-redux'
import { appLocaleSelector, currentLocaleSelector, currentUserSelector } from '../redux/selectors'
import { useAuth } from '../contexts/AuthContext'
import { Locale } from '../resources/translations'

export const useLocale = () => {
  const user = useSelector(currentUserSelector)
  const { isLoggedIn } = useAuth()
  const hasAccess = user && isLoggedIn
  const userLocale = useSelector(currentLocaleSelector)
  const appLocale = useSelector(appLocaleSelector)
  const locale = hasAccess ? userLocale : appLocale
  return locale as Locale
}
