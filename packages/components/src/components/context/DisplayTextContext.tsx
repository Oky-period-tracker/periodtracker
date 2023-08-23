import React from 'react'
import Tts from 'react-native-tts'
import _ from 'lodash'
import { translate } from '../../i18n'
import { useSelector } from '../../hooks/useSelector'
import * as selectors from '../../redux/selectors'

interface Props {
  text: null | string
  setDisplayTextRandom: () => void
  setDisplayTextStatic: (translationKey: string) => void
  hideDisplayText: () => void
}

const DisplayTextContext = React.createContext<Props>(undefined)

export function DisplayTextProvider({ children }) {
  const availableText = useSelector(selectors.allAvatarText)

  const [text, setText] = React.useState(null)
  const hasTtsActive = useSelector(selectors.isTtsActiveSelector)

  const setDisplayTextRandom = () => {
    setText(_.sample(availableText).content)
  }

  const setDisplayTextStatic = (translationKey: string) => {
    setText(translate(translationKey))
  }

  const hideDisplayText = () => {
    setText(null)
  }

  React.useEffect(() => {
    if (!hasTtsActive || !text) {
      return
    }

    const translateText = translate(text)
    Tts.speak(translateText)
  }, [text])

  return (
    <DisplayTextContext.Provider
      value={{
        text,
        setDisplayTextRandom,
        setDisplayTextStatic,
        hideDisplayText,
      }}
    >
      {children}
    </DisplayTextContext.Provider>
  )
}

export function useDisplayText() {
  const displayTextContext = React.useContext(DisplayTextContext)
  if (displayTextContext === undefined) {
    throw new Error(`useDisplayText must be used within a DisplayTextProvider`)
  }

  return displayTextContext
}
