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
  // Optional
  genderIdentity?: string
  accommodationRequirement?: string
  religion?: string
  encyclopediaVersion?: string
}
