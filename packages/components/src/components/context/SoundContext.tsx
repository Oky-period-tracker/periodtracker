import React from 'react'
import _ from 'lodash'
import Sound from 'react-native-sound'

interface Props {
  playSound: (assetUrl?: string) => void
  stopSound: () => void
}

const SoundContext = React.createContext<Props>(undefined)

export function SoundProvider({ children }) {
  const sound = React.useRef(null)

  const playSound = (assetUrl?: string) => {
    if (!assetUrl) {
      return
    }

    if (sound.current) {
      sound.current.stop()
    }

    sound.current = new Sound(assetUrl, null, (error) => {
      if (error) {
        return
      }

      sound.current.setVolume(1)
      sound.current.play()
    })
  }

  const stopSound = () => {
    if (sound.current) {
      sound.current.stop()
      sound.current = null
    }
  }

  return (
    <SoundContext.Provider
      value={{
        playSound: _.throttle(playSound, 200),
        stopSound,
      }}
    >
      {children}
    </SoundContext.Provider>
  )
}

export function useSound() {
  const soundContext = React.useContext(SoundContext)
  if (soundContext === undefined) {
    throw new Error(`useSound must be used within a SoundProvider`)
  }

  React.useEffect(() => {
    return soundContext.stopSound
  })

  return soundContext
}
