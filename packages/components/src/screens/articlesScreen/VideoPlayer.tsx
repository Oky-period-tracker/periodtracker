import React from 'react'
import Video from 'react-native-video'
import YoutubePlayer from 'react-native-youtube-iframe'
import { Header } from '../../components/common/Header'
import { BackgroundTheme } from '../../components/layout/BackgroundTheme'
import { PageContainer } from '../../components/layout/PageContainer'
import { assets } from '../../assets'
import { VideoData } from '../../types'

export const VideoPlayerScreen = ({ onBack, videoData }) => {
  return (
    <BackgroundTheme>
      <PageContainer>
        <Header screenTitle="empty" onPressBackButton={onBack} />
        <VideoPlayer videoData={videoData} />
      </PageContainer>
    </BackgroundTheme>
  )
}

export const VideoPlayer = ({ videoData }: { videoData: VideoData }) => {
  const { youtubeId, assetName } = videoData

  // Bundled video
  if (assetName && assets?.videos && assets?.videos[assetName]) {
    return (
      <Video
        source={assets.videos[assetName]}
        style={{ width: '100%', height: 300 }}
        controls={true}
      />
    )
  }

  // Youtube video
  if (youtubeId) {
    return <YoutubePlayer height={300} width={400} videoId={youtubeId} />
  }

  return null
}
