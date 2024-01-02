import React from 'react'
import { speakArray, clearTTSQueue } from '../services/textToSpeech'
import { useCommonSelector } from '../redux/useCommonSelector'
import { commonSelectors } from '../redux/selectors'

export function useTextToSpeechHook({ navigation, text }) {
  const hasTtsActive = useCommonSelector(commonSelectors.isTtsActiveSelector)
  const [shouldSpeak, setShouldSpeak] = React.useState(false)

  React.useEffect(() => {
    const screenFocus = navigation.addListener('didFocus', () => {
      setShouldSpeak(true)
    })
    const screenWillBlur = navigation.addListener('willBlur', () => {
      setShouldSpeak(false)
    })

    return () => {
      screenFocus.remove()
      screenWillBlur.remove()
      setShouldSpeak(false)
    }
  }, [])

  React.useEffect(() => {
    const speechSchedule = async () => {
      if (hasTtsActive) {
        // @ts-ignore
        await clearTTSQueue()
        // @ts-ignore
        speakArray(text)
      }
    }

    if (shouldSpeak) {
      speechSchedule()
    }
  }, [shouldSpeak, hasTtsActive, text])
}
