import React from 'react'
import { Audio, AVPlaybackStatus } from 'expo-av'

export type SoundStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

export const useAudio = () => {
  const [playbackObject, setPlaybackObject] = React.useState<Audio.Sound | null>(null)
  const [assetUri, setAssetUri] = React.useState<string | null>(null)
  const [status, setStatus] = React.useState<SoundStatus>('idle')
  const [playbackStatus, setPlaybackStatus] = React.useState<AVPlaybackStatus | undefined>()

  const updateStatus = async () => {
    if (playbackObject) {
      const currentStatus = await playbackObject.getStatusAsync()
      setPlaybackStatus(currentStatus)
    }
  }

  React.useEffect(() => {
    const interval = setInterval(() => {
      updateStatus()
    }, 1000) // update every second
    return () => clearInterval(interval)
  }, [playbackObject])

  const loadSound = async (uri: string) => {
    setAssetUri(uri)

    try {
      if (playbackObject) {
        await playbackObject.unloadAsync()
        setPlaybackObject(null)
      }

      const { sound, status } = await Audio.Sound.createAsync({ uri }, { shouldPlay: false })

      if (!sound) {
        setStatus('error')
        return null
      }

      setPlaybackObject(sound)
      setAssetUri(uri)
      setPlaybackStatus(status)

      return sound
    } catch (error) {
      setStatus('error')
      return null
    }
  }

  const playSound = async (url: string) => {
    setStatus('loading')

    let sound = playbackObject
    const sameAsset = assetUri === url

    if (!sameAsset || !sound) {
      sound = await loadSound(url)
    }

    if (!sound) {
      setStatus('error')
      return
    }

    try {
      await sound.playAsync()
      setStatus('playing')
    } catch (error) {
      setStatus('error')
    }
  }

  const pauseSound = async () => {
    if (playbackObject && status === 'playing') {
      await playbackObject.pauseAsync()
      setStatus('paused')
    }
  }

  const stopSound = async () => {
    if (playbackObject) {
      await playbackObject.stopAsync()
      await playbackObject.unloadAsync()
      setPlaybackObject(null)
      setAssetUri(null)
      setStatus('idle')
    }
  }

  // Clean up the sound object
  const unloadSound = React.useCallback(() => {
    return () => {
      if (playbackObject) {
        playbackObject.unloadAsync()
        setPlaybackObject(null)
        setAssetUri(null)
        setStatus('idle')
      }
    }
  }, [playbackObject])

  // Set audio mode
  const setAudioMode = async () => {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    })
  }

  // Initiate on first render
  React.useEffect(() => {
    setAudioMode()
  }, [])

  return {
    playSound,
    pauseSound,
    stopSound,
    unloadSound,
    assetUri,
    playbackStatus,
    status,
  }
}
