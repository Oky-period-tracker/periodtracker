import React from 'react'
import styled from 'styled-components/native'
import { EmojiSelector } from '../../components/common/EmojiSelector'
import { Text, TextWithoutTranslation } from '../../components/common/Text'
import { capitalizeFLetter } from '../../i18n'

export const Category = ({ title, tags, onPress, isActive = false }) => {
  return (
    <CategoryContainer onPress={onPress}>
      <TitleContainer>
        <Title style={{ color: isActive ? '#e3629b' : '#ff9e00' }}>
          {capitalizeFLetter(title.trim())}
        </Title>
      </TitleContainer>
      <TagsContainer>
        <EmojiSelector
          title={tags.primary.name}
          isActive={isActive}
          isTextVisible={true}
          emoji={tags.primary.emoji}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            marginBottom: null,
          }}
          emojiStyle={{ fontSize: 20 }}
          textStyle={{
            position: 'absolute',
            bottom: -10,
            fontSize: 8,
            zIndex: 45,
            elevation: 6,
          }}
          color="#e3629b"
          onPress={onPress}
        />
      </TagsContainer>
    </CategoryContainer>
  )
}

export const VideoCategory = ({ onPress, isActive = false }) => {
  const tags = { primary: { name: 'videos', emoji: '🎥' } }

  return (
    <CategoryContainer onPress={onPress}>
      <TitleContainer>
        <VideosTitle style={{ color: isActive ? '#e3629b' : '#ff9e00' }}>videos</VideosTitle>
      </TitleContainer>
      <TagsContainer>
        <EmojiSelector
          title={tags.primary.name}
          isActive={isActive}
          isTextVisible={true}
          emoji={tags.primary.emoji}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            marginBottom: null,
          }}
          emojiStyle={{ fontSize: 20 }}
          textStyle={{
            position: 'absolute',
            bottom: -10,
            fontSize: 8,
            zIndex: 45,
            elevation: 6,
          }}
          color="#e3629b"
          onPress={onPress}
        />
      </TagsContainer>
    </CategoryContainer>
  )
}

const CategoryContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 12px;
  padding-bottom: 12px;
  background-color: #fff;
  elevation: 5;
  border-radius: 10px;
  margin-vertical: 4px;
  margin-horizontal: 4px;
  min-height: 80px;
`

const TagsContainer = styled.View`
  flex-direction: row;
  height: 50px;
  width: 50px;
  justify-content: center;
  align-items: center;
`

const TitleContainer = styled.View`
  flex: 1;
`

const Title = styled(TextWithoutTranslation)`
  font-family: Roboto-Black;
  font-size: 18;
`

const VideosTitle = styled(Text)`
  font-family: Roboto-Black;
  font-size: 18;
`
