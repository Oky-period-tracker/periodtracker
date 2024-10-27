export * from './dailyCards'

export type Await<T> = T extends Promise<infer U> ? U : T

export interface User {
  id: string
  name: string
  dateOfBirth: string
  gender: string
  location: string
  country: string
  province: string
  secretQuestion: string
  dateSignedUp: string
  isGuest: boolean
  metadata: UserMetadata
}

export interface UserCredentials {
  password: string
  secretAnswer: string
}

export interface UserMetadata {
  // PH
  accommodationRequirement?: string
  religion?: string
  contentSelection?: number
  city?: string
  isProfileUpdateSkipped?: boolean
}
