import React from 'react'
import Video from 'react-native-video'
import YoutubePlayer from 'react-native-youtube-iframe'
import { Header } from '../components/common/Header'
import { assets } from '../assets'
import { VideoData } from '../types'
import { StyleSheet, View } from 'react-native'
import Orientation from 'react-native-orientation-locker'
import { useScreenDimensions } from '../hooks/useScreenDimensions'

export const VideoScreen = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <Header screenTitle="empty" />
      <VideoPlayer navigation={navigation} />
    </View>
  )
}

export const VideoPlayer = ({ navigation }: { navigation: any }) => {
  const videoData = navigation.getParam('videoData') as VideoData // TODO_ALEX
  const { youtubeId, assetName } = videoData

  const { screenWidth, screenHeight } = useScreenDimensions()

  React.useEffect(() => {
    Orientation.unlockAllOrientations()
    return () => {
      Orientation.lockToPortrait()
    }
  }, [])

  // Bundled video
  if (assetName && assetName.length > 0 && assets?.videos && assets?.videos[assetName]) {
    return (
      <Video
        source={assets.videos[assetName]}
        style={styles.bundleVideo}
        controls={true}
        fullscreenAutorotate={true}
        resizeMode={'contain'}
      />
    )
  }

  // Youtube video
  if (youtubeId && youtubeId.length > 0) {
    return (
      <View style={styles.youtubeContainer}>
        <YoutubePlayer width={screenWidth} height={screenHeight * 0.75} videoId={youtubeId} />
      </View>
    )
  }

  return null
}

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  bundleVideo: {
    flex: 1,
    width: '100%',
  },
  youtubeContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
