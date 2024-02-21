export interface SignupCommand {
  preferredId: string
  name: string
  dateOfBirth: Date
  gender: 'Male' | 'Female' | 'Other'
  genderIdentity: 'Oo' | 'Hindi' | 'Other'
  isPwd: string
  accommodationRequirement?: string
  religion: string
  encyclopediaVersion: string
  location: string
  country: string
  city: string
  province: string
  plainPassword: string
  secretQuestion: string
  secretAnswer: string
  dateSignedUp: string
  dateAccountSaved: string
}
