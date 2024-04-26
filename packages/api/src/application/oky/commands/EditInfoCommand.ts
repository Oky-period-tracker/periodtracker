export interface EditInfoCommand {
  userId: string
  name: string
  dateOfBirth: Date
  gender: 'Male' | 'Female' | 'Other'
  location: string
  secretQuestion: string
  genderIdentity?: string
  accommodationRequirement?: string
  religion?: string
  encyclopediaVersion?: string
  city?: string
  isProfileUpdateSkipped?: boolean
}
