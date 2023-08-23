import React from 'react'
import styled from 'styled-components/native'
import { EmojiSelector } from '../../components/common/EmojiSelector'
import { TextWithoutTranslation } from '../../components/common/Text'
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

const CategoryContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 15px;
  padding-bottom: 15px;
  background-color: #fff;
  elevation: 5;
  border-radius: 10px;
  margin-vertical: 5px;
  margin-horizontal: 3px;
  height: 80px;
`

const TitleContainer = styled.View`
  width: 200px;
  height: 100%;
  justify-content: center;
`

const TagsContainer = styled.View`
  flex-direction: row;
  height: 50px;
  width: 50px;
  justify-content: center;
  align-items: center;
  align-self: flex-end;
`

const Title = styled(TextWithoutTranslation)`
  font-family: Roboto-Black;
  font-size: 18;
`
