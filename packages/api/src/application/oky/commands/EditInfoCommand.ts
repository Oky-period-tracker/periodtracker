import { UserMetadata } from 'domain/oky/OkyUser'

export interface EditInfoCommand {
  userId: string
  name: string
  dateOfBirth: Date
  gender: 'Male' | 'Female' | 'Other'
  location: string
  secretQuestion: string
  metadata: UserMetadata
}
