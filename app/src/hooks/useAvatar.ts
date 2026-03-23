import { useSelector } from '../redux/useSelector'
import { currentUserSelector } from '../redux/selectors'

export interface AvatarData {
  bodyType: 'small' | 'medium' | 'large'
  skinColor?: string | undefined // Optional - undefined means use default gray
  hairStyle: string | null
  hairColor?: string | undefined
  eyeShape: string | null
  eyeColor?: string | undefined
  smile: string // Always present - defaults to 'smile' if not set
  clothing: string | null
  devices: string[] // Array of devices (supports subcategories)
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
  let bodyType: 'small' | 'medium' | 'large' = 'medium'
  if (avatar.body) {
    bodyType = avatar.body
  }

  return {
    bodyType,
    // Preserve undefined if not set - AvatarPreview will use default gray
    skinColor: avatar.skinColor || DEFAULT_SKIN_COLOR,
    hairStyle: avatar.hair || null,
    // Preserve undefined if not set - only show hair if color is selected
    hairColor: avatar.hairColor || DEFAULT_HAIR_COLOR,
    eyeShape: avatar.eyes || null,
    // Preserve undefined if not set - only show eyes if color is selected
    eyeColor: avatar.eyeColor || DEFAULT_EYE_COLOR,
    // Smile defaults to 'smile' if not set (always show smile)
    smile: avatar.smile || 'smile',
    clothing: avatar.clothing || null,
    devices: avatar.devices || [],
    name: avatar.name || 'Friend',
  }
}

