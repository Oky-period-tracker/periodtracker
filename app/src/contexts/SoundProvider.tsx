import React from 'react'
import { useAudio } from '../hooks/useAudio'

export type SoundContext = ReturnType<typeof useAudio>

const emptyPromise = async () => {
  await Promise.all([])
}

const defaultValue: SoundContext = {
  playSound: emptyPromise,
  pauseSound: emptyPromise,
  stopSound: emptyPromise,
  unloadSound: () => emptyPromise,
  assetUri: null,
  playbackStatus: undefined,
  status: 'idle',
}

const SoundContext = React.createContext<SoundContext>(defaultValue)

export const SoundProvider = ({ children }: React.PropsWithChildren) => {
  const value = useAudio()
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}

export const useSound = () => {
  return React.useContext(SoundContext)
}
