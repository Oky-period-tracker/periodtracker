import { IsNotEmpty, MinLength, IsIn, IsDateString } from 'class-validator'
const minNameLength = 3
const minPasswordLength = 1
export class SignupRequest {
  public readonly preferredId: string

  @IsNotEmpty()
  @MinLength(minNameLength, {
    message: 'Name is too short',
  })
  public readonly name: string

  @IsDateString()
  public readonly dateOfBirth: string

  @IsNotEmpty()
  @IsIn(['Male', 'Female', 'Other'])
  public readonly gender: 'Male' | 'Female' | 'Other'

  // @TODO:PH
  @IsNotEmpty()
  @IsIn(['Oo', 'Hindi', 'Other'])
  public readonly genderIdentity: 'Oo' | 'Hindi' | 'Other'

  @IsNotEmpty()
  public readonly isPwd: string

  public readonly accommodationRequirement?: string

  @IsNotEmpty()
  public readonly religion: string

  @IsNotEmpty()
  public readonly encyclopediaVersion: string

  @IsNotEmpty()
  public readonly location: string

  @IsNotEmpty()
  public readonly country: string

  @IsNotEmpty()
  public readonly city: string

  @IsNotEmpty()
  public readonly province: string

  @IsNotEmpty()
  @MinLength(minPasswordLength, {
    message: 'Password is too short',
  })
  public readonly password: string

  @IsNotEmpty()
  public readonly secretQuestion: string

  @IsNotEmpty()
  @MinLength(minPasswordLength, {
    message: 'Secret answer is too short',
  })
  public readonly secretAnswer: string

  public readonly dateSignedUp: string
}
