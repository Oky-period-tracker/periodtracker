import React from 'react'
import { Keyboard } from 'react-native'

export function useKeyboardController() {
  const [keyboardIsOpen, setKeyboardIsOpen] = React.useState(false)

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardIsOpen(true),
    )
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardIsOpen(false),
    )

    return () => {
      keyboardDidShowListener.remove()
      keyboardDidHideListener.remove()
    }
  }, [])

  return {
    keyboardIsOpen,
    dismiss: () => Keyboard.dismiss(),
  }
}
