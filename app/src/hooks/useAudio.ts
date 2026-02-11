import React from 'react'
import { createAudioPlayer, setAudioModeAsync, AudioPlayer, AudioStatus } from 'expo-audio'

export type SoundStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

export interface PlaybackProgress {
  currentTime: number
  duration: number
  isLoaded: boolean
}

export const useAudio = () => {
  const [player, setPlayer] = React.useState<AudioPlayer | null>(null)
  const [assetUri, setAssetUri] = React.useState<string | null>(null)
  const [status, setStatus] = React.useState<SoundStatus>('idle')
  const [playbackProgress, setPlaybackProgress] = React.useState<PlaybackProgress>({
    currentTime: 0,
    duration: 0,
    isLoaded: false,
  })

  // Poll playback status
  React.useEffect(() => {
    if (!player) return

    const onStatusChange = (audioStatus: AudioStatus) => {
      setPlaybackProgress({
        currentTime: audioStatus.currentTime,
        duration: audioStatus.duration,
        isLoaded: audioStatus.isLoaded,
      })

      if (audioStatus.playing) {
        setStatus('playing')
      } else if (audioStatus.isLoaded && audioStatus.currentTime > 0 && status === 'playing') {
        setStatus('paused')
      }
    }

    const subscription = player.addListener('playbackStatusUpdate', onStatusChange)
    return () => subscription.remove()
  }, [player])

  const loadSound = (uri: string): AudioPlayer => {
    if (player) {
      player.remove()
    }

    const newPlayer = createAudioPlayer({ uri })
    setPlayer(newPlayer)
    setAssetUri(uri)
    return newPlayer
  }

  const playSound = async (url: string) => {
    setStatus('loading')

    try {
      let currentPlayer = player
      const sameAsset = assetUri === url

      if (!sameAsset || !currentPlayer) {
        currentPlayer = loadSound(url)
      }

      currentPlayer.play()
      setStatus('playing')
    } catch (error) {
      setStatus('error')
    }
  }

  const pauseSound = async () => {
    if (player && status === 'playing') {
      player.pause()
      setStatus('paused')
    }
  }

  const stopSound = async () => {
    if (player) {
      player.pause()
      await player.seekTo(0)
      setAssetUri(null)
      setStatus('idle')
    }
  }

  // Clean up the sound object
  const unloadSound = React.useCallback(() => {
    return () => {
      if (player) {
        player.remove()
        setPlayer(null)
        setAssetUri(null)
        setStatus('idle')
      }
    }
  }, [player])

  // Set audio mode
  const setAudioMode = async () => {
    await setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: false,
      shouldRouteThroughEarpiece: false,
      allowsRecording: false,
      interruptionMode: 'mixWithOthers',
    })
  }

  // Initiate on first render
  React.useEffect(() => {
    setAudioMode()
  }, [])

  // Clean up on unmount
  React.useEffect(() => {
    return () => {
      if (player) {
        player.remove()
      }
    }
  }, [player])

  return {
    playSound,
    pauseSound,
    stopSound,
    unloadSound,
    assetUri,
    playbackProgress,
    status,
  }
}
