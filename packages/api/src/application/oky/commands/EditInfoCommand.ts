export interface EditInfoCommand {
  userId: string
  name: string
  dateOfBirth: Date
  gender: 'Male' | 'Female' | 'Other'
  genderIdentity: 'Oo' | 'Hindi' | 'Other' // @TODO:PH
  isPwd: string
  accommodationRequirement?: string
  religion: string
  encyclopediaVersion: string
  location: string
  city: string
  secretQuestion: string
  isProfileUpdateSkipped?: boolean
}
