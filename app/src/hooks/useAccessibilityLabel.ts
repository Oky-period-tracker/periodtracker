import { Platform } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslate } from './useTranslate'
import { translationsSelector } from '../redux/selectors/contentSelectors'
import type { ReduxState } from '../redux/reducers'

export const useAccessibilityLabel = () => {
  const translate = useTranslate()
  
  // Ensure selector is always a function
  const selector = translationsSelector || ((state: ReduxState) => state?.content?.translations || {})
  const translations = useSelector(selector) || {}

  return (labelKey: string, shouldTranslate = true) => {
    if (!labelKey) {
      return ''
    }

    // First try to get from CMS (unified translations)
    let label = translations[labelKey]
    
    // If not found in CMS, fall back to app translations (for backward compatibility)
    if (!label && shouldTranslate) {
      label = translate(labelKey)
    } else if (!label) {
      label = labelKey
    }

    // Convert literal \n to actual newlines
    if (label && typeof label === 'string') {
      label = label.replace(/\\n/g, '\n')
    }

    if (Platform.OS === 'ios') {
      return `${label}. ${translate('accessibility_prompt')}`
    }

    return label
  }
}
