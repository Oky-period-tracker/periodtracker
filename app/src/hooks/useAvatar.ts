import { useSelector } from '../redux/useSelector'
import { currentUserSelector } from '../redux/selectors'

export interface AvatarData {
  bodyType: 'body-small' | 'body-medium' | 'body-large'
  skinColor: string
  hairStyle: string | null
  hairColor: string
  eyeShape: string | null
  eyeColor: string
  smile: string | null
  clothing: string | null
  devices: string | null
  name: string
}

const DEFAULT_SKIN_COLOR = '#FFDBAC'
const DEFAULT_HAIR_COLOR = '#000000'
const DEFAULT_EYE_COLOR = '#000000'

/**
 * Hook to get current user's avatar data
 * Returns avatar configuration that can be used with AvatarPreview component
 */
export const useAvatar = (): AvatarData | null => {
  const currentUser = useSelector(currentUserSelector)

  if (!currentUser?.avatar) {
    return null
  }

  const avatar = currentUser.avatar

  // Convert body type to new format if needed
  let bodyType: 'body-small' | 'body-medium' | 'body-large' = 'body-medium'
  if (avatar.body) {
    if (avatar.body === 'body1' || avatar.body === 'body-small') {
      bodyType = 'body-small'
    } else if (avatar.body === 'body2' || avatar.body === 'body-medium') {
      bodyType = 'body-medium'
    } else if (avatar.body === 'body3' || avatar.body === 'body-large') {
      bodyType = 'body-large'
    }
  }

  return {
    bodyType,
    skinColor: avatar.skinColor || DEFAULT_SKIN_COLOR,
    hairStyle: avatar.hair || null,
    hairColor: avatar.hairColor || DEFAULT_HAIR_COLOR,
    eyeShape: avatar.eyes || null,
    eyeColor: avatar.eyeColor || DEFAULT_EYE_COLOR,
    smile: avatar.smile || 'smile',
    clothing: avatar.clothing || null,
    devices: avatar.devices || null,
    name: avatar.name || 'Friend',
  }
}

