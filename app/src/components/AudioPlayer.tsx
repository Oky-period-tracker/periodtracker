import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { View, StyleSheet } from 'react-native'
import { useSound } from '../contexts/SoundProvider'
import { Button } from './Button'
import { AVPlaybackStatus } from 'expo-av'
import { PaletteStatus, useColor } from '../hooks/useColor'
import { useThrottledFunction } from '../hooks/useThrottledFunction'
import { Spinner } from './Spinner'
import { ErrorText } from './ErrorText'

export const AudioPlayer = ({ audioAssetUri }: { audioAssetUri: string }) => {
  const { playSound, pauseSound, assetUri, playbackStatus, status } = useSound()
  const [loading, setLoading] = React.useState(false)

  const assetSelected = assetUri === audioAssetUri
  const isPlaying = assetSelected && status === 'playing'
  const error = assetSelected && status === 'error'

  const togglePlayPause = () => {
    isPlaying ? pauseSound() : playSound(audioAssetUri)
  }

  const toggleThrottled = useThrottledFunction(togglePlayPause, 350)

  const paletteStatus = loading || error ? 'basic' : assetSelected ? 'secondary' : 'primary'
  const icon = isPlaying ? 'pause' : 'play'

  React.useEffect(() => {
    const isNowLoading = assetSelected && status === 'loading'
    setLoading(isNowLoading)
  }, [assetSelected, status])

  if (!audioAssetUri) {
    return null
  }

  return (
    <View style={styles.container}>
      <Button onPress={toggleThrottled} status={paletteStatus} style={styles.button}>
        {loading ? (
          <Spinner>
            <FontAwesome size={12} name={'rotate-right'} color={'#fff'} />
          </Spinner>
        ) : (
          <FontAwesome size={12} name={icon} color={'#fff'} />
        )}
      </Button>
      {assetSelected && (
        <ProgressBar playbackStatus={playbackStatus} paletteStatus={paletteStatus} />
      )}
      {error && <ErrorText style={styles.error}>error</ErrorText>}
    </View>
  )
}

const ProgressBar = ({
  playbackStatus,
  paletteStatus,
}: {
  playbackStatus: AVPlaybackStatus | undefined
  paletteStatus: PaletteStatus
}) => {
  const { palette } = useColor()

  if (!playbackStatus || !playbackStatus.isLoaded || !playbackStatus.durationMillis) {
    return null
  }

  const color = palette[paletteStatus].base
  const progress = (playbackStatus.positionMillis / playbackStatus.durationMillis) * 100

  return (
    <View style={[styles.progressBarContainer, { borderColor: color }]}>
      <View style={[styles.progressBar, { width: `${progress}%`, backgroundColor: color }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  button: {
    width: 26,
    height: 26,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    borderWidth: 1,
    flexDirection: 'row',
    marginLeft: 12,
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  error: {
    marginLeft: 12,
  },
})
