import React from 'react'
import { TextWithoutTranslation } from './Text'

interface IEmojiText {
  content: string
}

export const EmojiText = ({ content }: IEmojiText) => {
  if (content) {
    return (
      <TextWithoutTranslation style={{ fontSize: 25 }}>
        {content.substring(0, 2)}
      </TextWithoutTranslation>
    )
  }

  return null
}
