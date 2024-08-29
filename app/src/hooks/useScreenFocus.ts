import { useNavigation } from '@react-navigation/native'
import React from 'react'

export const useScreenFocus = () => {
  const navigation = useNavigation()

  const [isFocussed, setIsFocussed] = React.useState(false)

  React.useEffect(() => {
    const screenFocus = navigation.addListener('focus', () => {
      setIsFocussed(true)
    })

    const screenWillBlur = navigation.addListener('blur', () => {
      setIsFocussed(false)
    })

    return () => {
      screenFocus()
      screenWillBlur()
      setIsFocussed(false)
    }
  }, [])

  return isFocussed
}
