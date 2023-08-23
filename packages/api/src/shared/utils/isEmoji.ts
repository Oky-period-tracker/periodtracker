import createEmojiRegex from 'emoji-regex'

export function isEmoji(str: string) {
  const emojiRegex = createEmojiRegex()
  const match = str.match(emojiRegex)
  return match && match.length === 1
}
