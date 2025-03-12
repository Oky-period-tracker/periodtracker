import { UserMetadata } from 'domain/oky/OkyUser'

export interface SignupCommand {
  preferredId: string
  name: string
  dateOfBirth: Date
  gender: 'Male' | 'Female' | 'Other'
  location: string
  country: string
  province: string
  plainPassword: string
  secretQuestion: string
  secretAnswer: string
  dateSignedUp: string
  dateAccountSaved: string
  metadata: UserMetadata
}
