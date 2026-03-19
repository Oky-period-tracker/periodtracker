import { useSelector } from '../redux/useSelector'
import { currentUserSelector } from '../redux/selectors'

export interface AvatarData {
  bodyType: 'body-small' | 'body-medium' | 'body-large'
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

const DEFAULT_HAIR_COLOR = '#000000'
const DEFAULT_EYE_COLOR = '#000000'

/**
 * Hook to get current user's avatar data
 * Returns avatar configuration that can be used with AvatarPreview component
 * Preserves undefined values for colors so AvatarPreview can use default gray when no color is selected
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
    // Preserve undefined if not set - AvatarPreview will use default gray
    skinColor: avatar.skinColor ?? undefined,
    hairStyle: avatar.hair || null,
    // Preserve undefined if not set - only show hair if color is selected
    hairColor: avatar.hairColor ?? undefined,
    eyeShape: avatar.eyes || null,
    // Preserve undefined if not set - only show eyes if color is selected
    eyeColor: avatar.eyeColor ?? undefined,
    // Smile defaults to 'smile' if not set (always show smile)
    smile: avatar.smile || 'smile',
    clothing: avatar.clothing || null,
    // Convert devices from string (old format) or array (new format) to array
    devices: (() => {
      const devices = avatar.devices
      if (!devices) return []
      if (Array.isArray(devices)) return devices
      // Old format: single string, convert to array
      return [devices]
    })(),
    // Preserve undefined if not set
    name: avatar.name ?? undefined,
  }
}

