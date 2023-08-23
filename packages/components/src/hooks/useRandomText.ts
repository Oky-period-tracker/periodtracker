import React from 'react'
import { useDisplayText } from '../components/context/DisplayTextContext'

export function useRandomText({ navigation }) {
  const { setDisplayTextRandom } = useDisplayText()
  const [shouldDisplayText, setShouldDisplayText] = React.useState(false)

  React.useEffect(() => {
    const screenFocus = navigation.addListener('didFocus', () => {
      setShouldDisplayText(true)
    })
    const screenWillBlur = navigation.addListener('willBlur', () => {
      setShouldDisplayText(false)
    })

    return () => {
      screenFocus.remove()
      screenWillBlur.remove()
      setShouldDisplayText(false)
    }
  }, [])

  React.useEffect(() => {
    let intervalId
    if (shouldDisplayText) {
      intervalId = setInterval(setDisplayTextRandom, 20000)
    }
    return () => {
      clearTimeout(intervalId)
    }
  }, [shouldDisplayText])
}
