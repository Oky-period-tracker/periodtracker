import React from 'react'
import styled from 'styled-components/native'
import { FlatList } from 'react-native'
import { PageContainer } from '../components/layout/PageContainer'
import { BackgroundTheme } from '../components/layout/BackgroundTheme'
import { useSelector } from '../hooks/useSelector'
import * as selectors from '../redux/selectors'
import { Header } from '../components/common/Header'
import { TextWithoutTranslation } from '../components/common/Text'
import { VideoData } from '../types'
import { navigate } from '../services/navigationService'

export const VideoItem = ({
  videoId,
  onSelect,
}: {
  videoId: string
  onSelect: React.Dispatch<React.SetStateAction<VideoData>>
}) => {
  const videoObject = useSelector((state) => selectors.videoByIDSelector(state, videoId))

  if (!videoObject) {
    return null
  }

  return (
    <VideoTab
      onPress={() => onSelect(videoObject)}
      style={{
        width: '95%',
        minWidth: '95%',
      }}
    >
      <VideoRow style={{ alignItems: 'center' }}>
        <VideoTitle>{videoObject.title}</VideoTitle>
      </VideoRow>
    </VideoTab>
  )
}

export function VideosScreen({ navigation }) {
  const categoryId = navigation.getParam('categoryId')
  const category = useSelector((state) => selectors.categoryByIDSelector(state, categoryId))
  const videos = category?.videos || []

  return (
    <BackgroundTheme>
      <PageContainer>
        <Header screenTitle="encyclopedia" />
        <FlatList
          data={videos}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return (
              <VideoItem
                videoId={item}
                onSelect={(videoData) => navigate('VideoScreen', { videoData })}
              />
            )
          }}
          style={{ width: '100%' }}
          contentContainerStyle={{ alignItems: 'center', width: '100%' }}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(_, index) => index.toString()}
        />
      </PageContainer>
    </BackgroundTheme>
  )
}

const VideoRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`

const VideoTab = styled.TouchableOpacity`
  margin-vertical: 5px;
  border-radius: 10px;
  elevation: 3;
  background-color: #fff;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-horizontal: 40;
`

const VideoTitle = styled(TextWithoutTranslation)`
  font-size: 20;
  font-family: Roboto-Black;
  color: #e3629b;
`
