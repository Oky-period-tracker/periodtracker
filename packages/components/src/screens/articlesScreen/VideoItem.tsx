import React from 'react'
import styled from 'styled-components/native'
import { useSelector } from '../../hooks/useSelector'
import * as selectors from '../../redux/selectors'
import { TextWithoutTranslation } from '../../components/common/Text'
import { VideoData } from '../../types'

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
