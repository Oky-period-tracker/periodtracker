import React from 'react'
import Video from 'react-native-video'
import YoutubePlayer from 'react-native-youtube-iframe'
import { Header } from '../components/common/Header'
import { assets } from '../assets'
import { VideoData } from '../types'
import { Alert, Dimensions, StyleSheet, View } from 'react-native'
import Orientation from 'react-native-orientation-locker'
import { useScreenDimensions } from '../hooks/useScreenDimensions'
import { translate } from '../i18n'
import { BackOneScreen } from '../services/navigationService'

export const VideoScreen = ({ navigation }) => {
  return (
    <View style={styles.screen}>
      <Header screenTitle="empty" />
      <VideoPlayer navigation={navigation} />
    </View>
  )
}

const ConfirmAlert = ({
  title,
  text,
  onPress,
  onCancel,
}: {
  title: string
  text: string
  onPress: () => void
  onCancel: () => void
}) => {
  Alert.alert(
    title,
    text,
    [
      {
        text: translate('cancel'),
        onPress: onCancel,
        style: 'cancel',
      },
      { text: translate('yes'), onPress },
    ],
    { cancelable: false },
  )
}

export const VideoPlayer = ({ navigation }: { navigation: any }) => {
  const videoData = navigation.getParam('videoData') as VideoData // TODO_ALEX
  const { youtubeId, assetName } = videoData
  const { screenWidth, screenHeight } = useScreenDimensions()

  const [canUseInternet, setCanUseInternet] = React.useState(false)
  const onConfirm = () => setCanUseInternet(true)

  const canPlayBundleVideo =
    assetName && assetName.length > 0 && assets?.videos && assets?.videos[assetName]

  const hasYoutubeVideo = youtubeId && youtubeId.length > 0
  const canPlayYoutubeVideo = hasYoutubeVideo && canUseInternet

  React.useEffect(() => {
    if (canPlayBundleVideo || canPlayYoutubeVideo || !hasYoutubeVideo) {
      return
    }

    ConfirmAlert({
      title: translate('internet_required_title'),
      text: translate('internet_required_text'),
      onPress: onConfirm,
      onCancel: () => BackOneScreen(),
    })
  }, [])

  React.useEffect(() => {
    Orientation.unlockAllOrientations()
    return () => {
      Orientation.lockToPortrait()
    }
  }, [])

  // Bundled video
  if (canPlayBundleVideo) {
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

  const videoAspectRatio = 16 / 9 // Aspect ratios might need to be saved in VideoData object if they vary

  let videoWidth = screenWidth
  let videoHeight = videoWidth / videoAspectRatio

  if (screenWidth > screenHeight) {
    videoHeight = screenHeight
    videoWidth = videoHeight * videoAspectRatio
  }

  if (canPlayYoutubeVideo) {
    // Youtube video
    return (
      <View style={styles.youtubeContainer}>
        <YoutubePlayer width={videoWidth} height={videoHeight} videoId={youtubeId} />
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
