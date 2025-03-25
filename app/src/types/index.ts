export * from './dailyCards'

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
  metadata: UserMetadata
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
