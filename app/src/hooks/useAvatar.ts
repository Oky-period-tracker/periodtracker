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
  let bodyType: 'small' | 'medium' | 'large'
  if (avatar.body) {
    bodyType = avatar.body
  } else {
    bodyType = 'medium'
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
    devices: avatar.devices ?? [],
    // Preserve undefined if not set
    name: avatar.name ?? '',
  }
}
