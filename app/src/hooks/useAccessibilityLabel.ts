import { Platform } from 'react-native'
import { useTranslate } from './useTranslate'

export const useAccessibilityLabel = () => {
  const translate = useTranslate()

  return (labelKey: string, shouldTranslate = true) => {
    if (!labelKey) {
      return ''
    }

    const label = shouldTranslate ? translate(labelKey) : labelKey

    if (Platform.OS === 'ios') {
      return `${label}. ${translate('accessibility_prompt')}`
    }

    return label
  }
}
