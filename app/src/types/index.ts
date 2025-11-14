export * from './dailyCards'

export interface AvatarConfig {
  body?: string | null
  hair?: string | null
  eyes?: string | null
  smile?: string | null
  clothing?: string | null
  devices?: string | null
  customAvatarUnlocked: boolean
  name?: string
}

export interface User {
  id: string
  name: string
  dateOfBirth: string
  gender: string
  location: string
  country: string
  province: string
  password: string
  secretQuestion: string
  secretAnswer: string
  dateSignedUp: string
  isGuest: boolean
  cyclesNumber?: number
  metadata: UserMetadata
  avatar?: AvatarConfig | null
}

export interface UserMetadata {
  // PH
  accommodationRequirement?: string
  religion?: string
  contentSelection?: number
  city?: string
  isProfileUpdateSkipped?: boolean
  periodDates?: { date: string; mlGenerated: boolean; userVerified: boolean | null }[]
}
