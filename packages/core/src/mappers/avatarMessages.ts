import { AvatarMessagesResponse } from '../api/types'

interface AvatarMessageItem {
  id: string
  content: string
}
export interface AvatarMessages extends Array<AvatarMessageItem> {}

export type AvatarMessage = ReturnType<typeof fromAvatarMessages>

export function fromAvatarMessages(response: AvatarMessagesResponse) {
  const avatarMessages = response.reduce<AvatarMessages>((data, message) => {
    data.push({ id: message.id, content: message.content })
    return data
  }, [])
  return { avatarMessages }
}
